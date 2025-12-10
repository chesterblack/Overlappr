import { MouseEventHandler } from "react";
import { SearchResult } from "../types";
import Image from "next/image";

interface Props {
	item: SearchResult
	onClick: MouseEventHandler<HTMLDivElement>
}

export default function SearchResultItem( { item, onClick }: Props ) {
	return (
		<div className="search-option" onClick={ () => onClick( item.fullItem ) }>
			{ item.image &&
				<Image
					className="search-image"
					src={ item.image.url }
					height={ item.image.height }
					width={ item.image.width }
					alt={ item.image.alt }
				/>
			}

			<div>
				<span className="search-title">{ item.title }</span>
				{ item.subtitle && <span className="search-subtitle">{ item.subtitle }</span> }
			</div>
		</div>
	);
}