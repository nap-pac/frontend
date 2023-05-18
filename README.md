# Notes for running the project

## Tailwind watch command
```css
npx tailwindcss -i ./static/src/input.css -o ./static/src/output.css --watch
```

## Run the project
```bash
python manage.py runserver
```

## Copy flowbite.min.js from node_modules to production
```bash
cp node_modules/flowbite/dist/flowbite.min.js static/vendor/flowbite.min.js
```

## Curl Leaflet
```bash
mkdir -p static/vendor/images
curl https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/leaflet.min.js -o static/vendor/leaflet.min.js
curl https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/leaflet.css -o static/vendor/leaflet.css
curl https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/layers.png -o static/vendor/images/layers.png
curl https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/layers-2x.png -o static/vendor/images/layers-2x.png
curl https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon.png -o static/vendor/images/marker-icon.png
curl https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon-2x.png -o static/vendor/images/marker-icon-2x.png
curl https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png -o static/vendor/images/marker-shadow.png
```

## For testing web on windows
```powershell
while ($true) {python manage.py runcrons;start-sleep 60}
```

## Notes
https://tailwindcss.com/docs/customizing-colors#using-custom-colors
https://flowbite.com/docs/components/sidebar/#off-canvas-sidebar
