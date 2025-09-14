# 🚀 RxJS Series - Interactive Learning Platform# RxjsSeries



A comprehensive Angular application demonstrating RxJS operators with real-world examples and interactive demonstrations.This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.5.



## 📋 Table of Contents## Development server

- [Overview](#overview)

- [Features](#features)Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

- [Operators Covered](#operators-covered)

- [Installation](#installation)## Code scaffolding

- [Usage](#usage)

- [Project Structure](#project-structure)Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

- [Technologies Used](#technologies-used)

- [Contributing](#contributing)## Build



## 🎯 OverviewRun `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.



This project is an educational Angular application that provides hands-on learning experiences for RxJS operators. Each operator includes:## Running unit tests



- 📚 **Comprehensive definitions** explaining what the operator doesRun `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

- 🌟 **Real-life examples** with practical use cases

- 🎮 **Interactive demonstrations** showing operators in action## Running end-to-end tests

- 💻 **Live code examples** with syntax highlighting

- 🎨 **Modern Bootstrap UI** with responsive designRun `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.



## ✨ Features## Further help



- **Interactive Demos**: Click-to-run examples with real API callsTo get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

- **Real-world Scenarios**: Practical examples like search autocomplete, file uploads, API retry logic
- **Live API Integration**: Demonstrates merge operator with actual HTTP requests to JSONPlaceholder API
- **Modern UI/UX**: Clean, professional interface with Bootstrap 5
- **Educational Content**: Step-by-step explanations and best practices
- **Error Handling**: Comprehensive error handling examples
- **Performance Optimization**: Debouncing, throttling, and other performance techniques

## 🔧 Operators Covered

### ✅ Fully Enhanced Operators:
- **🔗 MergeMap**: Flattening observables with parallel execution
- **🔄 SwitchMap**: Latest value switching with cancellation
- **📏 Take**: Limiting emissions and performance optimization  
- **➡️ ConcatMap**: Sequential processing maintaining order
- **⏱️ DebounceTime**: Input debouncing and performance optimization
- **🔀 Merge**: Combining multiple observables concurrently
- **🔄 Retry**: Error handling with automatic retry mechanisms

### 🚧 Available Operators:
- Filter, Map, Pluck, Subject, ReplaySubject
- From, Of, Interval, FromEvent
- ToArray, All, Custom Observables
- And many more...

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Angular CLI (v16+)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/rxjs-series.git
   cd rxjs-series
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

## 🎮 Usage

### Navigation
- Use the main dashboard to navigate between different RxJS operators
- Each operator has its own dedicated page with comprehensive examples

### Interactive Demos
- Click demo buttons to see operators in action
- Check browser console for detailed logging
- Real API calls demonstrate actual HTTP request handling

### Learning Path
1. Start with basic operators (Take, Map, Filter)
2. Progress to transformation operators (MergeMap, SwitchMap, ConcatMap)
3. Learn utility operators (Merge, DebounceTime, Retry)
4. Practice with real API integrations

## 📁 Project Structure

```
src/
├── app/
│   ├── observable/               # Main operators directory
│   │   ├── merge-map/           # MergeMap operator examples
│   │   ├── switch-map/          # SwitchMap operator examples
│   │   ├── take/                # Take operator examples
│   │   ├── concatmap/           # ConcatMap operator examples
│   │   ├── debounce/            # DebounceTime operator examples
│   │   ├── merge/               # Merge operator examples
│   │   ├── retry/               # Retry operator examples
│   │   └── [other-operators]/   # Additional operators
│   ├── services/                # Utility services
│   └── includes/                # Shared components
├── assets/                      # Static assets
└── styles.css                   # Global styles
```

## 💻 Technologies Used

- **Frontend**: Angular 16+ (Standalone Components)
- **Styling**: Bootstrap 5, Custom CSS
- **HTTP Client**: Angular HttpClient for real API calls
- **RxJS**: Version 7+ for reactive programming
- **APIs**: JSONPlaceholder for demo API calls
- **Icons**: Font Awesome for UI icons

## 🌐 Live Demos

### Real API Integration
The merge operator demo makes actual HTTP requests to:
- `GET /users?_limit=3` - User data
- `GET /posts?_limit=2` - Post data  
- `GET /comments?_limit=2` - Comment data

All requests run in parallel using the merge operator!

### Interactive Features
- **Search Debouncing**: Type in search boxes to see debouncing in action
- **Button Click Handling**: Rapid click demos with proper debouncing
- **Error Simulation**: Retry mechanisms with real network calls
- **Performance Monitoring**: Visual feedback for optimization techniques

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Enhancement Ideas
- Add more RxJS operators
- Implement additional real API integrations
- Add unit tests for operators
- Improve UI/UX design
- Add more interactive demos

---

## Development

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.5.

### Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

### Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests
Run `ng e2e` to execute the end-to-end tests via a platform of your choice.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

⭐ **Star this repository if it helped you learn RxJS!** ⭐

Built with ❤️ for the Angular and RxJS community