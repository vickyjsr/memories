# Birthday Website with Passcode Protection

A beautiful, romantic birthday website with a secure passcode system to protect your special memories.

## 🔐 Passcode Setup

This website is protected by a passcode system that supports multiple valid passcodes. To set up your custom passcodes:

### Option 1: Environment Variable (Recommended)
Create a `.env` file in the root directory and add:
```
# Single passcode
REACT_APP_PASSCODE=your-secret-passcode

# OR Multiple passcodes (comma-separated)
REACT_APP_PASSCODE=passcode1,passcode2,passcode3
```

### Option 2: GitHub Environment Variables
If deploying to GitHub Pages or similar platforms:
1. Go to your repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Add a new repository secret named `REACT_APP_PASSCODE`
4. Set its value to your desired passcode(s):
   - Single: `your-secret-passcode`
   - Multiple: `passcode1,passcode2,passcode3`

### Default Passcode
If no environment variable is set, the default passcode is: `birthday2024`

### Multiple Passcodes Example
You can set multiple passcodes for different people:
```
REACT_APP_PASSCODE=birthday2024,love123,special2024,forever
```
Any of these passcodes will grant access to the website.

## Features
- 🔐 Secure passcode authentication with multiple valid codes
- 💾 Persistent login (24 hours)
- 📱 Responsive design
- 🎨 Beautiful animations
- 💕 Romantic timeline and memories

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
