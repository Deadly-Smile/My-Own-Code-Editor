/* eslint-disable react/prop-types */
import { GrPowerReset } from "react-icons/gr";
import { useEffect, useState } from "react";
import ToggleTheme from "./ToggleTheme";
import { Editor } from "@monaco-editor/react";
import { useGetSubmissionResultQuery, useSubmitCodeMutation } from "../store";

const themeOptions = ["cobalt", "vs-dark", "light", "hc-black"];
const initialCode =
  localStorage.getItem("source_code") || "// enter your code here...\n";
const initialTheme = "vs-dark";
const height = "83vh";
const width = "100%";
const resetLabel = "Reset";
const isDisabledSubmit = false;
const submitText = "Submit";
const Home = ({ languages }) => {
  const [theme, setTheme] = useState(initialTheme);
  const [sourceCode, setSourceCode] = useState(initialCode);
  const [input, setInput] = useState(localStorage.getItem("input") || "");
  const [output, setOutput] = useState(
    localStorage.getItem("expected_output") || ""
  );
  const [expectedOutput, setExpectedOutput] = useState("");
  const [setectedLanguage, setSelectedLanguage] = useState({
    id: 54,
    name: "C++ (GCC 9.2.0)",
  });
  const [status, setStatus] = useState({ ind: "success", text: "Idle" });
  const [submitCode, result] = useSubmitCodeMutation();
  const { data } = useGetSubmissionResultQuery();

  useEffect(() => {
    if (data) {
      if (data.compile_output) {
        setOutput(atob(data.compile_output));
      }
      if (data.stdout) {
        setOutput(atob(data.stdout));
      }
      if (data.status?.id === 3) {
        setStatus({ ind: "success", text: data.status?.description });
      } else if (data.status?.id === 4) {
        setStatus({ ind: "error", text: data.status?.description });
      } else {
        setStatus({ ind: "info", text: data.status?.description });
      }
      console.log(data);
    }
  }, [data]);
  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };
  const resetCode = () => {
    setSourceCode(initialCode);
  };
  const handleSourceCodeChange = (value) => {
    setSourceCode(value);
  };

  const handleInputChange = (value) => {
    setInput(value);
  };

  const handleOutputChange = (value) => {
    setOutput(value);
  };

  const handleLanguageChange = (event) => {
    languages.find((language) => {
      if (language.name === event.target.value) {
        setSelectedLanguage(language);
      }
    });
  };

  const handleExpectedOutputChange = (value) => {
    setExpectedOutput(value);
  };

  const onSubmit = () => {
    // console.log(sourceCode, setectedLanguage, input, expectedOutput);
    submitCode({
      sourceCode,
      languageId: setectedLanguage.id,
      input,
      expectedOutput,
    });
  };

  useEffect(() => {
    if (result.isSuccess) {
      setStatus({ ind: "success", text: "Submitted" });
    } else {
      setStatus({ ind: "error", text: "Error" });
    }
  }, [result.isSuccess]);

  useEffect(() => {
    if (result.isLoading) {
      setStatus({ ind: "warning", text: "Wating for response" });
    }
  }, [result.isLoading]);

  return (
    <div className="flex flex-col flex-grow bg-base-100 py-4 px-8 w-full">
      <div className="flex justify-between">
        <div className="flex justify-start">
          <span
            className={`text-3xl font-bold ${
              status.ind === "success"
                ? "text-success"
                : status.ind === "warning"
                ? "text-warning"
                : status.ind === "error"
                ? "text-error"
                : "text-info"
            }`}
          >
            {status.text}
          </span>
        </div>
        <div className="flex items-center ml-auto space-x-4 mb-2">
          <select
            value={theme}
            onChange={handleThemeChange}
            className="select select-sm select-bordered w-full max-w-xs"
          >
            {themeOptions.map((themeOption, index) => (
              <option key={index} value={themeOption}>
                {themeOption}
              </option>
            ))}
          </select>
          <select
            value={setectedLanguage?.name}
            onChange={handleLanguageChange}
            className="select select-sm select-bordered w-full max-w-xs"
          >
            {languages?.map((language) => (
              <option key={language.id} value={language?.name}>
                {language?.name}
              </option>
            ))}
          </select>
          <button className="btn btn-sm btn-warning" onClick={resetCode}>
            <span className="flex">
              <GrPowerReset className="text-sm font-semibold mr-1" />
              {resetLabel}
            </span>
          </button>
          <button
            className="btn btn-sm btn-success"
            disabled={isDisabledSubmit}
            onClick={() => onSubmit(sourceCode)}
          >
            {submitText}
          </button>
          <ToggleTheme className="ml-5" />
        </div>
      </div>

      <div className="mb-2 flex">
        <div className="w-2/3">
          <Editor
            height={height}
            width={width}
            language={setectedLanguage}
            value={sourceCode}
            theme={theme}
            defaultValue={sourceCode}
            onChange={handleSourceCodeChange}
          />
        </div>
        <div className="divider divider-horizontal" />
        <div className="w-1/3 space-y-4">
          <>
            <p className="text-xl">Input</p>
            <Editor
              height={"20vh"}
              width={"90%"}
              language={setectedLanguage}
              value={input}
              theme={theme}
              onChange={handleInputChange}
            />
          </>
          <>
            <p className="text-xl">Output</p>
            <Editor
              height={"20vh"}
              width={"90%"}
              language={setectedLanguage}
              value={output}
              theme={theme}
              onChange={handleOutputChange}
            />
          </>
          <>
            <p className="text-xl">Expected Output</p>
            <Editor
              height={"20vh"}
              width={"90%"}
              language={setectedLanguage}
              value={expectedOutput}
              theme={theme}
              onChange={handleExpectedOutputChange}
            />
          </>
        </div>
      </div>
    </div>
  );
};

export default Home;
