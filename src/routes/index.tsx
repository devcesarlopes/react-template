import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";
import reactLogo from "@/assets/react.svg";
import { MyComponent } from "@/components/MyComponent";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	const [count, setCount] = useState(0);

	return (
		<>
			<div>
				<a href="https://vite.dev" target="_blank">
					<img src={"/vite.svg"} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button
					className={twMerge(
						"bg-orange-400 p-3 text-white",
						count && "bg-red-600",
						count > 10 && "bg-blue-900",
					)}
					onClick={() => setCount((count) => count + 1)}
				>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="bg-slate-900 text-3xl font-bold underline">
				Click on the Vite and React logos to learn more
			</p>
			<p className="bg-gray-100 text-3xl font-bold underline">
				Click on the Vite and React logos to learn more
			</p>
			<MyComponent />
		</>
	);
}
