# Impact Scribe

## Project setup
```
yarn install
```

## Create env files
Create the following files and fill the corresponding values from corresponding firebase project
```
.env.development
.env.production
```


### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Deploy to firebase hosting
* Login to firebase cli
```
firebase login
``` 
* If you are already logged in, the firebase cli will return current account, if it is not the correct one, you need to log out first
```
firbase logout
```

* Run the corresponding script according to the environment you want to deploy
```
yarn deploy:dev
yarn deploy:prod
```
