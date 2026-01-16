import { Dispatch, SetStateAction, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import "./AddLetterBody.css";

import { GoogleGenAI } from "@google/genai";

//Custom Components
import TextInput from "../../components/Inputs/TextInput";
import SelectInput from "../../components/Inputs/SelectInput";

//Data
import { Recipients, Departments } from "../../data";

//Material UI
import { Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getDate, getDay } from "../../utils/formatDate";
import { PDFDownloadLink } from "@react-pdf/renderer";
import LetterHead from "../../components/LetterHead/LetterHead";

type AddLetterBodyProps = {
  club: string;
  setClub: Dispatch<SetStateAction<string>>;
};

function AddLetterBody({ club, setClub }: AddLetterBodyProps) {
  //States
  const [prompt, setPrompt] = useState<string>("");
  //   const [response, setResponse] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [recipient, setRecipient] = useState<string>("Principal");
  const [department, setDepartment] = useState<string>(
    "Dept. of Computer Science"
  );
  const [toAddress, setToAddress] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [subject, setSubject] = useState<string>();
  const [body, setBody] = useState<string>();
  const [open, setOpen] = useState<boolean>(false);
  const [letterBody, setLetterBody] = useState({
    recipient: "Principal",
    designation: "",
    department: "Dept. of Computer Science",
    toAddress: "",
    date: "",
    day: "",
    subject: "",
    body: "",
  });
  const [parent] = useAutoAnimate(/* optional config */);

  const sendPromptToGeminiAPI = async () => {
    if (!prompt) {
      setError("Please enter a prompt.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setError("Gemini API key not found");
        return;
      }

      const ai = new GoogleGenAI({ apiKey });

      const finalPrompt = `Write the body of a formal letter requesting permission to ${prompt} from the ${recipient} ${
        recipient === "HOD" ? `of the ${department}` : ""
      }. The tone should be polite and professional. Do not include address, greeting, or signature.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: finalPrompt,
      });

      if (!response?.text) {
        setError("No response generated");
        return;
      }

      setBody(response.text);
    } catch (err) {
      console.error(err);
      setError("Gemini request failed");
    } finally {
      setLoading(false);
    }
  };

  const errorSetter = () => {
    if (!toAddress) setToAddress("");
    if (!subject) setSubject("");
    if (!body) setBody("");
  };

  const handlePrintButton = () => {
    if (!date || !subject || !body || (recipient === "Others" && !toAddress)) {
      errorSetter();
    } else {
      setLetterBody({
        recipient,
        designation:
          recipient === "Principal" ? "The Principal" : "Head of Department",
        department,
        toAddress,
        date: getDate(date),
        day: getDay(date),
        subject,
        body,
      });
      setOpen(true);
    }
  };

  const ToggleDisplay = () => {
    setShow(!show);
  };

  return (
    <div className="body-container">
      <div className="back-btn" onClick={() => setClub("none")}>
        <span>{`<`} Back</span>
      </div>
      <h3>{club} Letter Head</h3>
      <div className="body-form" ref={parent}>
        <SelectInput
          label="Recipient of letter"
          menuItems={Recipients}
          value={recipient}
          setValue={setRecipient}
        />
        {recipient === "HOD" && (
          <SelectInput
            label="Department"
            menuItems={Departments}
            value={department}
            setValue={setDepartment}
          />
        )}
        {recipient === "Others" && (
          <TextInput
            multiline
            rows="3"
            label="To Address"
            value={toAddress}
            setValue={setToAddress}
          />
        )}
        <DatePicker
          label="Date"
          value={date}
          format="dd/MM/yyyy"
          onChange={(newValue) => {
            setDate(newValue as Date);
          }}
          disablePast
        />
        <TextInput
          multiline
          label="Subject"
          value={subject}
          setValue={setSubject}
        />
        <p>
          To automatically generate the body of the letter, use the prompt
          generator below.{" "}
          <button onClick={ToggleDisplay} className="show-btn">
            {show ? "Hide" : "Show"}
          </button>
        </p>
        {show && (
          <>
            <textarea
              className="prompt-input"
              placeholder="Enter event details (e.g., Tech Fest, date, venue, program name)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            {error && <p className="error-msg">{error}</p>}
            <Button
              fullWidth
              onClick={sendPromptToGeminiAPI}
              variant="contained"
              disabled={loading}
            >
              {loading ? "Generating..." : "Send Prompt"}
            </Button>
          </>
        )}
        <TextInput
          multiline
          rows="9"
          label={loading ? "Generating..." : "Letter Body"}
          value={body}
          setValue={setBody}
        />

        <Button fullWidth onClick={handlePrintButton} variant="contained">
          <span>Print</span>
        </Button>
        <PDFDownloadLink
          document={<LetterHead club={club} data={{}} />}
          fileName={`${club}-letter.pdf`}
        >
          <Button variant="contained" fullWidth>
            Download Empty
          </Button>
        </PDFDownloadLink>
      </div>
      {open && (
        <div className="pdf-download" ref={parent}>
          <PDFDownloadLink
            document={<LetterHead club={club} data={letterBody} />}
            fileName={`${club}-letter.pdf`}
          >
            {({ loading }) =>
              loading ? (
                <Button fullWidth disabled>
                  Loading...
                </Button>
              ) : (
                <Button variant="contained" fullWidth>
                  Download
                </Button>
              )
            }
          </PDFDownloadLink>
        </div>
      )}
    </div>
  );
}

export default AddLetterBody;
