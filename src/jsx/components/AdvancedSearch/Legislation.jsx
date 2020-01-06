import React, { useState } from "react";

import ListBox from "./ListBox.jsx";
import useDebouncedFetch from "./useDebouncedFetch.jsx";

const Legislation = ({ value, id, onChange, className, isPopulated }) => {
	const [act, setAct] = useState(value.act || "");
	const [section, setSection] = useState(value.section || "");
	const { results: actResults, setJumpFetch: setIsActSelected } = useDebouncedFetch({
		source: "http://localhost:8085/legislation/acts?search=",
		term: act
	});
	const { results: sectionResults, setJumpFetch: setIsSectionSelected } = useDebouncedFetch({
		source: () => `http://localhost:8085/legislation/acts/${act}/sections?search=`,
		term: section
	});
	const actions = {
		act: { set: setAct, onSelection: setIsActSelected },
		section: { set: setSection, onSelection: setIsSectionSelected }
	};
	const onValueChange = (value, target, isSelection) => {
		actions[target].set(value);
		actions[target].onSelection(isSelection);
		onChange({ id, value, valueInObject: target });
	};

	return (
		<div className={className}>
			<div className="compound-field">
				<ListBox
					id={`act-${id}`}
					value={act}
					automatic
					isPopulated={isPopulated}
					hint="You should select one."
					labelText="Act"
					results={actResults}
					textSelection={result => result.legislationTitle}
					onInputValueChange={value => onValueChange(value, "act")}
					onSelection={({ legislationTitle = "" }) => onValueChange(legislationTitle, "act")}
				/>
			</div>
			<div className="compound-field">
				<ListBox
					id={`section-${id}`}
					value={section}
					automatic
					isPopulated={isPopulated}
					hint="You should select one."
					labelText="Section"
					results={sectionResults}
					textSelection={result => result.section}
					onInputValueChange={value => onValueChange(value, "section")}
					onSelection={({ section: value = "" }) => onValueChange(value, "section")}
				/>
			</div>
		</div>
	);
};

export default Legislation;