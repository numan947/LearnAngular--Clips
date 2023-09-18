# CONFIGURING FIREBASE API
To use this project, you need to configure your own Firebase API. Follow the steps below to configure your own Firebase API.
1. Step 1: cd "PATH_TO_PROJECT". For example, `cd C:\Users\user\Documents\GitHub\clips`.
2. Step 2: `ng g environments` --> two files will be generated under `environment` folder. One is `environment.ts` and the other is `environment.development.ts`.
3. Step 3: Copy the following code snippet to both of the files. 
```typescript
export const environment = {
	production: true,
	firebase:{
		apiKey: "<YOUR API KEY>",
		authDomain: "<YOUR AUTH DOMAIN>",
		projectId: "<YOUR PROJECT ID>",
		storageBucket: "<YOUR STORAGE BUCKET ID>",
		messagingSenderId: "<YOUR MESSAGING SENDER ID>",
		appId: "<YOUR APP ID>"
	  },
};
```
4. Step 4: Generate and add your own Firebase API key to the code snippet. 
5. Step 5: In the `environment.development.ts` file, set production: false.


# Clips

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
