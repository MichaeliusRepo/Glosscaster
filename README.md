[Demo](https://github.com/user-attachments/assets/63494012-9b8c-4b28-a3fe-c0aba3a44e7e)

____

A media system and file explorer in the style of the Playstation 3 XMB that runs in browsers through React and Node.js. As a tech-demo, only the file exploration and stylization has been implemented as of yet.

Written in TypeScript, the demo uses Vite and React Three Fiber to render 3D graphics in the browser to create the visual style. This front-end can explore files that is located on the device that hosts the back-end server, which uses Node.js.

## Demo

You may find a [demo available here](http://glosscaster-ui.s3-website.eu-north-1.amazonaws.com/), hosted on AWS S3 (front-end) and Lambda (back-end). WebGL must be enabled in your browser for React Three Fiber to properly render. Navigate the menus using the arrow keys on your keyboard.

Beware that only the file explorer is implemented - other menus (Settings, Music, Videos, Pictures) are not implemented. Mouse navigation is also not implemented.

## Setup

Clone the repository and use a command-line interface to run the back-end server. In PowerShell, this would be
```
cd backend
npm run dev
```

Then open another console and do the same with the front-end:
```
cd frontend
npm run dev
```

The front-end console should yield a localhost link, which you can open in a browser. 

## Notes

* The right-most object is a clock - the blocks light up according to the hour of the day.
* The hue (background color) changes depending on which minute of the hour that the front-end is loaded.
* The project includes functional godrays, but were omitted for now.
* The back-end server also retrieves information about CPU and RAM usage, but a display has yet to be implemented.

## Credits

* All icons provided by https://www.flaticon.com/
* 3D rendering by React Three Fiber: https://github.com/pmndrs/react-three-fiber
* Fluid Distortion: https://github.com/whatisjery/react-fluid-distortion
* Particle Effects: https://github.com/wass08/wawa-vfx
* Godrays (unused): https://onion2k.github.io/r3f-by-example/examples/effects/postprocessing-godrays/
