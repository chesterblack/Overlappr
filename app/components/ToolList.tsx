import Link from "next/link";
import OverlapprIcon from "./OverlapprIcon";
import FindrIcon from "./FindrIcon";
import DiscovrIcon from "./DiscovrIcon";

export default function ToolList() {
	return (
		<nav>
			<Link href='/overlappr'><OverlapprIcon /></Link>
			<Link href='/findr'><FindrIcon /></Link>
			<Link href='/discovr'><DiscovrIcon /></Link>
		</nav>
	)
}