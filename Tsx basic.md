React & TypeScript Theory + Code Cheat Sheet
What is React?
React is a JavaScript library for building user interfaces.
It lets you create reusable components that update automatically when data changes.
Used for web apps, mobile apps, dashboards, and more.
What is TypeScript?
TypeScript is a superset of JavaScript that adds static typing.
It helps catch errors early and makes code easier to understand and maintain.
Key Concepts
1. Component
Definition: A building block of UI. Can be a button, form, page, etc.
Types: Functional (most common), Class (older style).
2. Props
Definition: Data passed from parent to child component.
Purpose: Customizes components.
3. State
Definition: Internal data that changes over time.
Purpose: Tracks user input, toggles, etc.
4. Hooks
Definition: Functions that add features to components (e.g., state, effects).
Examples: useState, useEffect, custom hooks.
5. Context
Definition: Global state shared across components.
Purpose: Theme, user info, language, etc.
6. Event Handling
Definition: Responding to user actions (clicks, form submissions).
7. Conditional Rendering
Definition: Show/hide UI based on state.
8. Composition
Definition: Combining components to build complex UIs.
Why Use React & TypeScript?
Reusable: Build once, use everywhere.
Efficient: Only updates what’s needed.
Safe: TypeScript catches mistakes before you run the code.
Scalable: Easy to grow your app as your team or features grow.
Example Project Structure
App
├── Header
├── Main
│   ├── SearchForm
│   └── FlightList
└── Footer
How Data Flows
Props: Parent → Child
State: Inside a component
Context: Global, accessible anywhere
How UI Updates
[User Action] --> [Event Handler] --> [setState] --> [UI Updates]
Code Examples (see previous message for full code blocks)
Variables, Arrays, Objects
Interfaces and Types
Functional/Class Components
Props and State
useEffect and Custom Hooks
List, Form, Modal, Layout Components
Context, Fragments, Conditional Rendering
Event Handling and Composition
Summary
React helps you build interactive UIs with reusable components.
TypeScript makes your code safer and easier to understand.
Components, props, state, hooks, and context are the core ideas.
Use lists, forms, modals, layouts, and events to build real apps.
Data flows from parent to child (props), inside components (state), or globally (context).
UI updates automatically when state changes.
Tip:
Think of React components as LEGO blocks. You build your app by snapping them together, customizing each block with props and state.



// 1. Primitive Variables
let age: number = 25; // Number variable
let name: string = "Redwan"; // String variable
let isActive: boolean = true; // Boolean variable

// 2. Array
let cities: string[] = ["Dhaka", "Chittagong"]; // Array of strings

// 3. Object
let user: { name: string; age: number } = { name: "Redwan", age: 25 }; // Object with properties

// 4. Interface (Defines object structure)
interface Flight {
  id: string;
  airline: string;
  price: number;
}
const myFlight: Flight = { id: "F123", airline: "Biman", price: 5000 }; // Using the interface

// 5. Type Alias (Custom type)
type Currency = "USD" | "EUR" | "BDT";
type UserID = string | number;

// 6. Functional Component (Most common React component)
function Hello() {
  return <h1>Hello, world!</h1>;
}

// 7. Class Component (Older style, rarely used now)
class Welcome extends React.Component {
  render() {
    return <h1>Welcome!</h1>;
  }
}

// 8. Props (Data passed to components)
function Greet(props: { name: string }) {
  return <h1>Hello, {props.name}!</h1>;
}
// Usage: <Greet name="Redwan" />

// 9. State (useState) (Internal data that changes)
function Counter() {
  const [count, setCount] = React.useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// 10. useEffect (Runs code on mount/update)
function Timer() {
  React.useEffect(() => {
    alert("Component loaded!");
  }, []);
  return <div>Timer</div>;
}

// 11. List Component (Display multiple items)
function CityList() {
  const cities = ["Dhaka", "Chittagong"];
  return (
    <ul>
      {cities.map(city => <li key={city}>{city}</li>)}
    </ul>
  );
}

// 12. Form Component (Handles user input)
function LoginForm() {
  const [name, setName] = React.useState("");
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Welcome, " + name);
  }
  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}

// 13. Modal Component (Popup over page)
function Modal({ show, onClose }: { show: boolean; onClose: () => void }) {
  if (!show) return null;
  return (
    <div>
      <div>Modal Content</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

// 14. Layout Component (Overall page structure)
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>Header</header>
      <main>{children}</main>
      <footer>Footer</footer>
    </div>
  );
}

// 15. Custom Hook (Reusable logic)
function useTitle(title: string) {
  React.useEffect(() => {
    document.title = title;
  }, [title]);
}

// 16. Context (Global state)
const ThemeContext = React.createContext("light");
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Page />
    </ThemeContext.Provider>
  );
}

// 17. Fragment (Group elements without extra HTML)
<>
  <h1>Title</h1>
  <p>Paragraph</p>
</>

// 18. Conditional Rendering (Show/hide UI)
{isLoading ? <div>Loading...</div> : <div>Loaded!</div>}

// 19. Event Handling (Respond to user actions)
<button onClick={() => alert("Clicked!")}>Click Me</button>

// 20. Component Composition (Combine components)
function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}
<Card>
  <h2>Title</h2>
  <p>Details</p>
</Card>
