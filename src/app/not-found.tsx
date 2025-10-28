import Link from "next/link"
export default function NotFound(){
    return(
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h1 className="text-center font-bold mt-9 text-4xl">404 Page Not Found</h1>
            <p>The page you tried to access doesn't exist!!!</p>
            <Link href="/">
                Return to home page
            </Link>
        </div>
    )
}