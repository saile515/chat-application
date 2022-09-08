export default function Submit(props: { label: string }) {
	return <input type="submit" value={props.label} className="bg-blue-500 rounded-lg my-4 py-2 text-white font-bold" />;
}
