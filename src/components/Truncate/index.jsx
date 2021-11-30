import React, { useEffect, useState } from 'react';

const Truncate = ({
  text,
  length = 50,
  trailingText = '...',
  className,
  ...rest
}) => {
  const [truncatedString, setTruncatedString] = useState('');

  let truncateText = () => {
    if (text.length > length) {
      setTruncatedString(
        text.substring(0, length - trailingText.length) + trailingText
      );
    } else {
      setTruncatedString(text);
    }
  };

  useEffect(() => {
    truncateText();
  }, []);

  return (
    <p
      {...rest}
      className={className}
      dangerouslySetInnerHTML={{
        __html: truncatedString,
      }}
    ></p>
  );
};

export default Truncate;
