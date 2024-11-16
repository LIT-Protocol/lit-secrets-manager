const _litActionCode = async () => {
    if (magicNumber >= 42) {
        LitActions.setResponse({ response:"The number is greater than or equal to 42!" });
    } else {
        LitActions.setResponse({ response: "The number is less than 42!" });
    }
  }
  
  export const litActionCode = `(${_litActionCode.toString()})();`;