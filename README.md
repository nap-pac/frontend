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
cp node_modules/flowbite/dist/flowbite.min.js static/src/flowbite.min.js
```

## Notes
https://tailwindcss.com/docs/customizing-colors#using-custom-colors
https://flowbite.com/docs/components/sidebar/#off-canvas-sidebar
