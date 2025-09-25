import React, { useRef, useEffect } from 'react';

const AutoSizingTextarea = (props) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      // We need to temporarily set the height to 'auto' to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Then set the height to the scrollHeight to make it fit its content
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [props.value]); // This effect runs whenever the value of the textarea changes

  return (
    <textarea {...props} ref={textareaRef} />
  );
};

export default AutoSizingTextarea;