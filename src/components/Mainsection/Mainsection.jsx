import React from "react";
import {
  Input,
  InputGroup,
  Badge,
  Heading,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { BsArrowReturnLeft } from "react-icons/bs";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { TbRefresh } from "react-icons/tb";
import { RxCopy } from "react-icons/rx";
import "./Mainsection.css";

function Mainsection() {
  // state variables
  const [command, setCommand] = React.useState("");
  const [commands, setCommands] = React.useState([]);
  const [response, setResponse] = React.useState("");
  const [enable, setEnable] = React.useState(true);

  // function to handle sse
  const sse = React.useCallback(() => {
    if (enable) {
      setEnable(false);
      setResponse("");
      const eventSource = new EventSource(
        "https://take-home-endpoints-yak3s7dv3a-el.a.run.app/sse"
      );

      eventSource.onmessage = (event) => {
        const newData = JSON.parse(event.data);
        if (newData.choices) {
          setResponse((prevResponse) => prevResponse + newData.choices[0].text);
        } else {
          setEnable(true);
          eventSource.close();
        }
      };

      eventSource.onerror = (event) => {
        console.error("SSE error occurred: ", event);
      };
    } else {
      alert("Please wait for the response to load");
    }
  });

  // function to handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    command != "" && setCommands([...commands, command]);
    setCommand("");
    e.target.reset();
  };

  // function to copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    alert("Copied to clipboard");
  };
  return (
    <div id="mainsection-container">
      {/* input container */}

      <div id="mainsection-input">
        <form action="" onSubmit={(e) => handleSubmit(e)}>
          <div id="input-container">
            <InputGroup display={"flex"} alignItems={"Center"}>
              <Input
                size={"lg"}
                type={"text"}
                placeholder="Ask me"
                onChange={(e) => {
                  setCommand(e.target.value);
                }}
                variant={"unstyled"}
                fontSize={"18px"}
              />
              <InputRightElement
                pointerEvents={"none"}
                color="gray.300"
                children={<BsArrowReturnLeft color="gray" />}
                margin="0px"
              />
            </InputGroup>
          </div>
        </form>
      </div>

      {/* frequent commands container */}

      <div id="frequent-commands--container">
        <p>Frequent commands</p>
        <div id="commands">
          {commands.map((data, index) => (
            <Badge
              key={index}
              color={"#F1F5F9"}
              background={"#64748B"}
              margin={"3px"}
              padding={"2px 8px"}
            >
              {data}
            </Badge>
          ))}
        </div>
      </div>

      {/* merlin response container */}
      <div id="merlin-response--container">
        <div id="merlin-response">
          <div id="merlin-header">
            <Heading fontSize={"18px"} fontWeight={700}>
              Merlin Says:
            </Heading>
            <div style={{ display: "flex" }}>
              {/* left right arrow */}
              <Badge
                display={"flex"}
                borderRadius={"8px"}
                backgroundColor={"#334155"}
                fontSize={"20px"}
                marginRight={"10px"}
                height={"30px"}
                width={"54px"}
                alignItems={"center"}
                justifyContent={"space-evenly"}
                color={"white"}
              >
                <BiLeftArrowAlt cursor={"pointer"} />

                <BiRightArrowAlt cursor={"pointer"} />
              </Badge>
              {/* refresh button */}
              <Badge
                display={"flex"}
                alignItems={"center"}
                borderRadius={"8px"}
                backgroundColor={"#334155"}
                fontSize={"20px"}
                marginRight={"10px"}
                width={"26px"}
                color={"white"}
                cursor={"pointer"}
                disabled={true}
                onClick={sse}
              >
                <TbRefresh />
              </Badge>
              {/* copy button */}
              <Badge
                display={"flex"}
                borderRadius={"8px"}
                backgroundColor={"#334155"}
                fontSize={"20px"}
                width={"26px"}
                alignItems={"center"}
                color={"white"}
                cursor={"pointer"}
                onClick={copyToClipboard}
              >
                <RxCopy />
              </Badge>
            </div>
          </div>
          <div id="response">
            <p>{response}</p>
          </div>
        </div>
      </div>

      {/* browser extensions container */}
      <div id="browser-extensions">
        <div id="chrome">
          <Text size={"lg"}>Add to Chrome</Text>
        </div>

        <div id="firefox">
          <Text size={"lg"}>Add to Firefox</Text>
        </div>
      </div>
    </div>
  );
}

export default Mainsection;
