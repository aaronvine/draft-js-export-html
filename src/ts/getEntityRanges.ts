import { OrderedSet, is, List } from 'immutable';
import { CharacterMetadata } from 'draft-js';

export type EntityKey = any;
export type Style = OrderedSet<string>;
export type StyleRange = [string, Style];
export type EntityRange = [EntityKey, Array<StyleRange>];
// type CharacterMetaList = List<CharacterMetadata>;
export type CharacterMetaList = any;

const EMPTY_SET: any = OrderedSet();

export default function getEntityRanges(text: string, charMetaList: CharacterMetaList): Array<EntityRange> {
	let charEntity: any = null;
	let prevCharEntity: any = null;
	let ranges: Array<EntityRange> = [];
	let rangeStart = 0;
	for (let i = 0, len = text.length; i < len; i++) {
		prevCharEntity = charEntity;
		let meta: CharacterMetadata = charMetaList.get(i);
		charEntity = meta ? meta.getEntity() : null;
		if (i > 0 && charEntity !== prevCharEntity) {
			ranges.push([
				prevCharEntity,
				getStyleRanges(
					text.slice(rangeStart, i),
					charMetaList.slice(rangeStart, i)
				),
			]);
			rangeStart = i;
		}
	}
	ranges.push([
		charEntity,
		getStyleRanges(
			text.slice(rangeStart),
			charMetaList.slice(rangeStart)
		),
	]);
	return ranges;
}

function getStyleRanges(text: string, charMetaList: CharacterMetaList): Array<StyleRange> {
	let charStyle = EMPTY_SET;
	let prevCharStyle = EMPTY_SET;
	let ranges = [];
	let rangeStart = 0;
	for (let i = 0, len = text.length; i < len; i++) {
		prevCharStyle = charStyle;
		let meta = charMetaList.get(i);
		charStyle = meta ? meta.getStyle() : EMPTY_SET;
		if (i > 0 && !is(charStyle, prevCharStyle)) {
			ranges.push([text.slice(rangeStart, i), prevCharStyle]);
			rangeStart = i;
		}
	}
	ranges.push([text.slice(rangeStart), charStyle]);
	return ranges;
}
