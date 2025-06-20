const generatePDFText = async () => {
  const savedGames = JSON.parse(
    localStorage.getItem("budgetBlitzSaveData")
  ).savedGames;
  const currentGame = await savedGames.filter((sg) => {
    return sg.currentGame === true;
  });
  if (currentGame.length !== 1) {
    console.log("SAVED GAME DATA CORRUPTED", savedGames);
    return;
  }

  // get purchasedItems and convert them to 5 or less credits per quantity remaining for each
  // get credits
  // get # of missions failed
  // get # of missions successful

  console.log(currentGame);

  //   for (const category in categories) {
  //     if (categories[category].length > 0) {
  //       text += `0 -20 Td (${
  //         category.charAt(0).toUpperCase() + category.slice(1)
  //       }:) Tj `;
  //       for (const item of categories[category]) {
  //         text += `0 -20 Td (    ${item.displayName}) Tj `;
  //       }
  //     } else if (categories[category].length === 0) {
  //       text += `0 -20 Td (${
  //         category.charAt(0).toUpperCase() + category.slice(1)
  //       }:) Tj `;
  //       text += `0 -20 Td (    None) Tj `;
  //     }
  //   }

  //   return { text, fileName: currentGame[0].dataName };
  // };

  // const downloadItemsPDF = async () => {
  //   const { text, fileName } = await generatePDFText();

  //   // Minimal PDF structure
  //   const pdfContent = `
  //   %PDF-1.4
  //   1 0 obj
  //   << /Type /Catalog /Pages 2 0 R >>
  //   endobj
  //   2 0 obj
  //   << /Type /Pages /Kids [3 0 R] /Count 1 >>
  //   endobj
  //   3 0 obj
  //   << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
  //   endobj
  //   4 0 obj
  //   << /Length 55 >>
  //   stream
  //   BT
  //   /F1 11 Tf
  //   100 700
  //   Td () Tj
  //   ${text}
  //   ET
  //   endstream
  //   endobj
  //   xref
  //   0 5
  //   0000000000 65535 f
  //   0000000010 00000 n
  //   0000000079 00000 n
  //   0000000178 00000 n
  //   0000000277 00000 n
  //   trailer
  //   << /Root 1 0 R /Size 5 >>
  //   startxref
  //   377
  //   %%EOF
  // `;

  //   // Create a Blob containing the PDF content
  //   const blob = new Blob([pdfContent], { type: "application/pdf" });

  //   // Create a link element
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = fileName + ".pdf"; // Name of the downloaded file

  //   // Append the link to the body, trigger the download, and remove the link
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
};
