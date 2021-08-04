import AppController from './controllers/app-controller';

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`./sw.js`)
    .then(() => {})
    .catch((err) => {
      throw new Error(err);
    });
});

new AppController().init();
