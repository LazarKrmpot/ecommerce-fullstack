import * as path from 'path';

import * as express from 'express';
import {
  MicroframeworkLoader,
  MicroframeworkSettings,
} from 'microframework-w3tec';
// import favicon from "serve-favicon";

export const publicLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined,
) => {
  if (!settings) return;
  const expressApp = settings.getData('express_app');
  expressApp
    // Serve static files like images from the public folder
    .use(
      express.static(path.join(__dirname, '..', 'public'), {
        maxAge: 31557600000,
      }),
    );

  // A favicon is a visual cue that client software, like browsers, use to identify a site
  // .use(favicon(path.join(__dirname, "..", "public", "favicon.ico")));
};
