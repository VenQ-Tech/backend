const React = require("react");
const EmailContent = ({
  investorName,
  investorEmail,
  propertyName,
  paymentAmount,
  numberOfUnits,
}) => {
  return React.createElement(
    "div",
    { className: "container" },
    React.createElement(
      "h1",
      null,
      "Confirmation of Payment Received - Expression of Interest Document Attached"
    ),
    React.createElement("p", null, `Dear ${investorName},`),
    React.createElement("p", null, "I hope this email finds you well."),
    React.createElement(
      "p",
      null,
      ` I am writing to confirm the receipt of your recent payment for investment in ${propertyName}. Thank you for your commitment and trust in Venq. `
    ),
    React.createElement(
      "p",
      null,
      ' Attached to this email is the "Expression of Interest" document, which outlines the details of your investment. '
    ),
    React.createElement(
      "p",
      null,
      " The next step in our process is to await the completion of the campaign. Once closed, we will proceed with legal documentations for the specified property. "
    ),
    React.createElement(
      "p",
      null,
      "Should you have any questions or require further information, please feel free to reach out."
    ),
    React.createElement(
      "p",
      null,
      "Thank you once again for your investment with Venq."
    ),
    React.createElement("p", null, "Best regards,"),
    React.createElement("p", null, "VENQ TEAM")
  );
};
module.exports = EmailContent;
