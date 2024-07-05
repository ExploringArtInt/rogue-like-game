// js/svg.js

export function loadSVG(url, color) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((svgData) => {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgData, "image/svg+xml");
      const svg = svgDoc.documentElement;

      // Change the color of all path and polygon elements
      svg.querySelectorAll("path, polygon").forEach((el) => {
        el.setAttribute("fill", color);
      });

      // Create a Blob from the modified SVG
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);

      // Create and load the image
      const svgImage = new Image();
      return new Promise((resolve) => {
        svgImage.onload = () => {
          URL.revokeObjectURL(url);
          resolve(svgImage);
        };
        svgImage.src = url;
      });
    });
}
