import { Button, Heading, Input, Radio, Label, Card, Badge } from 'theme-ui'
import RenderAsImage from 'react-render-as-image'
import { useState } from 'react'
import Result from '../lib/result'
import friendlyWords from 'friendly-words'
import fetch from 'isomorphic-unfetch'
import url from 'url'

function getWord(selection) {
	let words = friendlyWords[selection];
	let pick = Math.floor(Math.random() * words.length)
	let word = words[pick]
	return word
}

function toHex(bn) {
  var base = 16;
  var hex = bn.toString(base);
  if (hex.length % 2) {
    hex = '0' + hex;
  }
  return hex;
}

function chunkArray(array, size) {
	let result = [];
	for (let i = 0; i < array.length; i += size) {
		let chunk = array.slice(i, i + size);
		result.push(chunk);
	}
	return result;
}

const Form = () => {
	const [result, setResult] = useState({
		dayNumber: 1,
		setting: "words",
		customName: "My Monthly Challenge"
	})

	const [generated, setGenerated] = useState("");
	const [list, setList] = useState([]);

	function handleChange(evt) {
		const target = evt.target;
		let value = target.value;
		const name = target.name;
		setResult(prevState => ({
			...prevState,
			[name]: value
		}))
	}

	async function getData(evt) {
		let tempList = [];
		if (result.setting == 'words') {
			for (let i = 0; i < result.dayNumber; i++) {
				let choose = Math.round(Math.random());
				let prompt;
				switch (choose) {
					case 0:
						prompt = await getWord('predicates')
						break;
					case 1:
						prompt = await getWord('objects')
						break;
				}
				tempList.push(prompt);
			}
		} else if (result.setting == 'colors') {
			for (let i = 0; i < result.dayNumber; i++) {
				tempList.push([Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)])
			}
		}
		setGenerated(result.setting);
		setList(chunkArray(tempList, 10));
	}
	return (
		<>
			<Heading variant="subheadline">Number of prompts</Heading>
			<Input name="dayNumber" type="number" placeholder="e.g. 31 for Inktober" min="1" max="366" onChange={handleChange} value={result.dayNumber} />
			<br />
			<Heading variant="subheadline">Type of Prompt</Heading>
			<Label><Radio name="setting" onChange={handleChange} value={'words'} />words</Label>
			<Label><Radio name="setting" onChange={handleChange} value={'colors'} />colors</Label>
			<Heading variant="subheadline">Custom name</Heading>
			<Input name="customName" placeholder="Your Drawing Challenge" value={result.customName} onChange={handleChange} />
			<br />
			<Button onClick={getData}>Generate</Button>
			<br />
			<Card>
				{generated != "" &&
				<>
						{list.map((section, index) => (
							<ol start={index * 10 + 1}>
								{section.map((element, index) => (
									generated == 'words' ? 
									<li key={index}>{element}</li> : 
									<li key={index}>
										<Badge sx={{backgroundColor: `rgb(${element[0]}, ${element[1]}, ${element[2]})`}}>
											{`#${toHex(element[0])}${toHex(element[1])}${toHex(element[2])}`}
										</Badge>
										</li>
								))}
							</ol>
						))}
						</>
				}
			</Card>
		</>
	)
}

export default Form