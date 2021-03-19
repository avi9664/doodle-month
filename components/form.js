import {
  Button,
  Heading,
  Input,
  Radio,
  Label,
  Card,
  Badge,
  Image,
  Container,
} from 'theme-ui'
import { useState } from 'react'
import html2canvas from 'html2canvas'
import friendlyWords from 'friendly-words'
import convert from 'color-convert'

function getWord(selection) {
  let words = friendlyWords[selection]
  let pick = Math.floor(Math.random() * words.length)
  let word = words[pick]
  return word
}

function chunkArray(array, size) {
  let result = []
  for (let i = 0; i < array.length; i += size) {
    let chunk = array.slice(i, i + size)
    result.push(chunk)
  }
  return result
}

const Form = () => {
  const [result, setResult] = useState({
    dayNumber: 1,
    setting: 'words',
    customName: 'My Monthly Challenge',
  })

  const [generated, setGenerated] = useState('')
  const [list, setList] = useState([])

  function handleChange(evt) {
    const target = evt.target
    let value = target.value
    const name = target.name
    setResult(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  async function getData(evt) {
    if (document.getElementById('card')) {
      document.getElementById('card').style.display = 'block'
    }
    let tempList = []
    if (result.setting == 'words') {
      for (let i = 0; i < result.dayNumber; i++) {
        let choose = Math.round(Math.random())
        let prompt
        switch (choose) {
          case 0:
            prompt = await getWord('predicates')
            break
          case 1:
            prompt = await getWord('objects')
            break
        }
        tempList.push(prompt)
      }
    } else if (result.setting == 'colors') {
      for (let i = 0; i < result.dayNumber; i++) {
        tempList.push([
          Math.floor(Math.random() * 256),
          Math.floor(Math.random() * 256),
          Math.floor(Math.random() * 256),
        ])
      }
    }
    setGenerated(result.setting)
    setList(chunkArray(tempList, 10))
  }

  function takeScreenshot() {
    // window.scrollTo(0, 0)
    const options = {
      backgroundColor: 'null',
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight,
    }
    html2canvas(document.getElementById('card'), options).then(function (
      canvas,
    ) {
      let screenshot = document.getElementById('screenshot')
      screenshot.src = canvas.toDataURL()
      screenshot.style.display = 'none'
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = screenshot.src
      // the filename you want
      a.download = 'doodle-month.png'
      document.body.appendChild(a)
      a.click()
      //   document.getElementById('card').style.display = 'none'
    })
  }

  return (
    <>
      <Heading variant="subheadline">Number of prompts</Heading>
      <Input
        name="dayNumber"
        type="number"
        className="grainy"
        placeholder="e.g. 31 for Inktober"
        min="1"
        max="366"
        onChange={handleChange}
        value={result.dayNumber}
      />
      <br />
      <Heading variant="subheadline">Type of Prompt</Heading>
      <Label>
        <Radio className="radio" name="setting" onChange={handleChange} value={'words'} />
        words
      </Label>
      <Label>
        <Radio className="radio" name="setting" onChange={handleChange} value={'colors'} />
        colors
      </Label>
      <br />
      <Heading variant="subheadline">Custom name</Heading>
      <Input
        name="customName"
        placeholder="Your Drawing Challenge"
        className="grainy"
        value={result.customName}
        onChange={handleChange}
      />
      <br />
      <Button sx={{ mb: [4] }} onClick={getData}>
        Generate
      </Button>
      <br />
      {generated != '' && (
        <>
          <Card id="card" className='grainy' sx={{ my: [3] }}>
            <Heading variant="headline" sx={{ textAlign: 'center' }}>
              {result.customName}
            </Heading>
            <div>
              <Container
                sx={{
                  display: 'flex',
                  flexFlow: 'row wrap',
                  flexBasis: '30%',
                  justifyContent: 'center',
                  margin: 'auto',
                }}
              >
                {list.map((section, index) => (
                  <ol
                    key={index}
                    start={index * 10 + 1}
                    sx={{ display: 'inline-block' }}
                  >
                    {section.map((element, index) =>
                      generated == 'words' ? (
                        <li key={index} sx={{ width: [0, 1] }}>
                          {element}
                        </li>
                      ) : (
                        <li key={index} sx={{ display: 'inline-block' }}>
                          <Badge
                            sx={{
                              border: '1px solid',
                              borderColor: 'border',
                              color: `hsl(0, 0%, ${
                                Math.round(
                                  (100 - convert.rgb.hsl(element)[2]) / 100,
                                ) * 100
                              }%)`,
                              backgroundColor: `rgb(${element[0]}, ${element[1]}, ${element[2]})`,
                            }}
                          >
                            {`#${convert.rgb.hex(element)}`}
                          </Badge>
                        </li>
                      ),
                    )}
                  </ol>
                ))}
              </Container>
            </div>
          </Card>
          <Image id="screenshot" />
          <Button onClick={takeScreenshot}>Download</Button>
        </>
      )}
      <style jsx>{`
        input [type='radio']:focus {
          background-color: #ffa987;
        }
      `}</style>
    </>
  )
}

export default Form
