import React from "react";
import {
  Input,
  InputGroup,
  Badge,
  Heading,
  InputRightElement,
  Text,
  Spinner,
  Image,
  Box,
  Button,
} from "@chakra-ui/react";
import { BsArrowReturnLeft } from "react-icons/bs";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { TbRefresh } from "react-icons/tb";
import { RxCopy } from "react-icons/rx";
import "./Mainsection.css";
//url for api
const url = "https://take-home-endpoints-yak3s7dv3a-el.a.run.app/sse";

function Mainsection() {
  // state variables
  const [command, setCommand] = React.useState("");
  const [commands, setCommands] = React.useState([]);
  const [response, setResponse] = React.useState("");
  const [enable, setEnable] = React.useState(true);
  const [visible, setVisible] = React.useState("none");
  const [bool, setBool] = React.useState(0);
  const [responses, setResponses] = React.useState([]);
  const [currentResponse, setCurrentResponse] = React.useState(-1);

  // function to handle sse
  const sse = React.useCallback(() => {
    if (enable) {
      setEnable(false);
      setResponse("");
      const eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        const newData = JSON.parse(event.data);
        if (newData.choices) {
          setResponse((prevResponse) => prevResponse + newData.choices[0].text);
        } else {
          setEnable(true);
          setVisible("flex");

          setCurrentResponse((prevCurrentResponse) =>
            prevCurrentResponse === responses.length - 1
              ? prevCurrentResponse + 1
              : responses.length
          );
          setBool((prevBool) => (prevBool == 0 ? 1 : 0));
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

  // function to handle left arrow
  const handleLeftArrow = () => {
    if (currentResponse > 0) {
      setCurrentResponse((prevCurrentResponse) => prevCurrentResponse - 1);
    }
  };

  // function to handle right arrow
  const handleRightArrow = () => {
    if (currentResponse < responses.length - 1) {
      setCurrentResponse((prevCurrentResponse) => prevCurrentResponse + 1);
    }
  };

  // function to handle responses
  React.useEffect(() => {
    setResponses((prevResponses) => [...prevResponses, response]);
    setResponses((prevResponses) => prevResponses.filter((data) => data != ""));
    console.log(responses);
  }, [bool]);

  // function to handle form submit
  const handleSubmit = (e) => {
    setResponses([]);
    setCurrentResponse(-1);
    setVisible("none");
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
                top={"none"}
              />
            </InputGroup>
          </div>
        </form>
      </div>
      {/* input container */}

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
              cursor={"pointer"}
            >
              {data}
            </Badge>
          ))}
        </div>
      </div>
      {/* frequent commands container */}

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
                display={visible}
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
                <BiLeftArrowAlt cursor={"pointer"} onClick={handleLeftArrow} />

                <BiRightArrowAlt
                  cursor={"pointer"}
                  onClick={handleRightArrow}
                />
              </Badge>
              {/* left right arrow */}

              {/* refresh button */}
              {enable ? (
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
              ) : (
                /* refresh button */
                <Badge
                  display={"flex"}
                  alignItems={"center"}
                  borderRadius={"8px"}
                  backgroundColor={"#334155"}
                  fontSize={"20px"}
                  marginRight={"10px"}
                  color={"white"}
                >
                  <Spinner size={"sm"} />
                </Badge>
              )}
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
              {/* copy button */}
            </div>
          </div>
          <div id="response">
            <p>{enable ? responses[currentResponse] : response}</p>
          </div>
        </div>
      </div>
      {/* merlin response container */}

      {/* browser extensions container */}
      <div id="browser-extensions">
        <Button variant={"unstyled"}>
          <div id="chrome">
            <Image
              src="https://img.icons8.com/fluency/30/null/chrome.png"
              alt="chrome"
              marginRight={"10px"}
              width={"20px"}
            />
            <Text fontWeight={"600"}>Add to Chrome</Text>
          </div>
        </Button>

        <Button variant={"unstyled"}>
          <div id="firefox">
            <Image
              src="https://img.icons8.com/external-those-icons-flat-those-icons/30/null/external-Firefox-logos-and-brands-those-icons-flat-those-icons.png"
              alt="firefox"
              marginRight={"10px"}
              width={"20px"}
            />
            <Text fontWeight={"600"}>Add to Firefox</Text>
          </div>
        </Button>
      </div>
      {/* browser extensions container */}
    </div>
  );
}

export default Mainsection;
