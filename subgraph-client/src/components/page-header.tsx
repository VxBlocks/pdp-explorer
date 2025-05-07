import { FileCode, Book, Calculator, Github } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { NetworkSelector } from "./shared/NetworkSelector";

export default function PageHeader() {
    const navigate = useNavigate()
    return (
        <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3" style={{userSelect: 'none',cursor: 'pointer'}}
            onClick={() => navigate('/')}
            >
                <div className="bg-blue-600 text-white p-2 rounded-md">
                    <FileCode className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    PDP Scan
                </h1>
            </div>
            <div className="flex items-center space-x-7">
                <Link
                    to="/documentation"
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm font-medium transition-colors flex items-center"
                >
                    <Book className="h-4 w-4 mr-1" />
                    Docs
                </Link>
                <Link
                    to="/gas-calculator"
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm font-medium transition-colors flex items-center"
                >
                    <Calculator className="h-4 w-4 mr-1" />
                    Gas Calculator
                </Link>
                <Link
                    to="https://github.com/FilOzone/pdp-explorer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm font-medium transition-colors flex items-center"
                    aria-label="GitHub Repository"
                >
                    <Github className="h-5 w-5" /> GitHub
                </Link>
                {/* Network Selector */}
                <NetworkSelector />
                {/* TODO: Fix colors to add this toggle ( default theme is light) */}
                {/* <ModeToggle />  */}
            </div>
        </div>
    )
}