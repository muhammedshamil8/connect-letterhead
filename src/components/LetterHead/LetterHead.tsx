/* eslint-disable react/prop-types */
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { Clubs } from "../../data/Clubs";

import fontRegular from "../../assets/Fonts/Montserrat-Regular.ttf";
import fontBold from "../../assets/Fonts/Montserrat-Medium.ttf";

Font.register({ family: "Montserrat", src: fontRegular });
Font.register({ family: "Montserrat-Bold", src: fontBold });

type LetterHeadProps = {
  club: string;
  data?: {
    recipient?: string;
    designation?: string;
    department?: string;
    toAddress?: string;
    date?: string;
    day?: string;
    subject?: string;
    body?: string;
  };
};

const LetterHead = ({ club, data = {} }: LetterHeadProps) => {
  const {
    recipient = "",
    designation = "",
    department = "",
    toAddress = "",
    date = "",
    day = "",
    subject = "",
    body = "",
  } = data;

  const dataExists = data.subject && data.body;
  console.log("Data in LetterHead:", dataExists);

  const styles = StyleSheet.create({
    header: {
      objectFit: "cover",
    },
    page: {
      position: "relative",
      fontFamily: "Montserrat",
      fontSize: 16,
      lineHeight: 1.3,
      paddingBottom: 60,
    },
    body: {
      position: "absolute",
      top: 120,
      paddingHorizontal: 42,
    },
    to: {
      paddingBottom: 20,
    },
    date: {
      paddingBottom: 20,
    },
    subject: {
      paddingBottom: 24,
      paddingRight: 46,
    },
    content: {
      textAlign: "left",
    },
    bold: {
      fontFamily: "Montserrat-Bold",
    },
    lineAboveFooter: {
      position: "absolute",
      bottom: 50,
      left: 0,
      right: 0,
      borderBottomWidth: 1,
      marginHorizontal: 30,
      borderBottomColor: "#d6d8dc",
    },
    footer: {
      backgroundColor: Clubs[club].color,
      color: "#fff",
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 35,
      textAlign: "center",
      fontFamily: "Montserrat-Bold",
      fontSize: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    footerImage: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
    watermark: {
      top: Clubs[club].watermarkPosition,
      zIndex: -1,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Image fixed style={styles.header} src={Clubs[club].header} />
        {/* Watermark */}
        <Image fixed src={Clubs[club].watermark} style={styles.watermark} />

        <View style={styles.body}>
          <View style={styles.to}>
            <Text>{dataExists ? "To," : ""}</Text>
            {recipient === "Others" ? (
              <Text>{toAddress}</Text>
            ) : designation === "Head of Department" ? (
              <>
                <Text>{designation}</Text>
                <Text>{department}</Text>
              </>
            ) : (
              <Text>{designation}</Text>
            )}
            {recipient !== "Others" && (
              <Text>
                {dataExists ? "EMEA College of Arts and Science" : ""}
              </Text>
            )}
          </View>
          <View style={styles.date}>
            <Text>{date}</Text>
            <Text>{day}</Text>
          </View>
          <Text style={styles.subject}>
            {dataExists ? `Subject: ${subject}` : ""}
          </Text>
          <Text style={{ marginBottom: 10 }}>{dataExists ? "Sir," : ""}</Text>
          <Text style={styles.content}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{body}
          </Text>
          <Text style={{ marginTop: 20 }}>
            {dataExists ? "Yours sincerely," : ""}
          </Text>
          <Text style={styles.bold}> {dataExists ? Clubs[club].name : ""}</Text>
        </View>

        {/* Footer */}
        {Clubs[club].haveCustomFooter ? (
          <Image fixed src={Clubs[club].footer} style={styles.footerImage} />
        ) : (
          <View fixed style={styles.footer}>
            <View style={styles.lineAboveFooter} />
            <Text>{Clubs[club].website}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default LetterHead;
