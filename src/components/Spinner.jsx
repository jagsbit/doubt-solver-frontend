// 🔁 Reusable Spinner JSX
const Spinner = ({ text = "Loading doubts..." }) => (
    <div className="flex flex-col items-center justify-center min-h-[20vh] space-y-4">
      <svg
        className="animate-spin h-10 w-10 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      <p className="text-gray-600 text-lg">{text}</p>
    </div>
  );
  export default Spinner;