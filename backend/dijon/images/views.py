from django.http import HttpResponse
from django.core.cache import cache
from PIL import Image
import io

def serve_image(request, image_name):
    size = request.GET.get('size', '')
    width, height = map(int, size.split('x'))
    cache_key = f"{image_name}_{width}x{height}"
    
    cached_image = cache.get(cache_key)
    if cached_image:
        return HttpResponse(cached_image, content_type='image/jpeg')

    try:
        with Image.open(f'images/assets/{image_name}') as img:
            if width < 320 or width > 3840 or height < 240 or height > 2160:
                raise ValueError("Invalid image size. Width and height should be between 320x240 and 3840x2160.")
    
            if img.width == width and img.height == height:
                img_resized = img
            else:
                img_resized = img.resize((width, height))

            buffer = io.BytesIO()
            img_resized.save(buffer, format='JPEG')
            buffer.seek(0)
            image_data = buffer.getvalue()

            cache.set(cache_key, image_data, timeout=3600)
            return HttpResponse(image_data, content_type='image/jpeg')
        
    
    except Exception as e:
        return HttpResponse(f'Error: {e}', status=404)
        