import { RuleTester } from "@typescript-eslint/utils/ts-eslint";
import { it } from "vitest";
import rule, { RULE_NAME } from "./ensure-matching-remove-event-listener";

const valids = [
  `useEffect(() => {
        doThis();
        doMoreOfThis();
        if (x) {
          doThisMore()
        }
        window.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        doSomeOtherStuff();
        return () => {
          doThatBefore();
          doMoreOfThatBefore();
          if (x) {
            doThisMore()
          }
          window.removeEventListener("keydown", handleUserKeyPress);
          doThatAfter();
          doMoreOfThatAfter();
        };
      }, [])`,
  `useEffect(() => {
        refcurrent = value;
      }, [value]);`,
  `useEffect(() => {
        doThis();
        doMoreOfThis();
        if (x) {
          doThisMore()
        }
        window.document.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        doSomeOtherStuff();
        return () => {
          doThatBefore();
          doMoreOfThatBefore();
          if (x) {
            doThisMore()
          }
          window.document.removeEventListener("keydown", handleUserKeyPress);
          doThatAfter();
          doMoreOfThatAfter();
        };
      }, [])`,
  `useEffect(() => {
        doThis();
        doMoreOfThis();
        if (x) {
          doThisMore()
        }
        document.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        doSomeOtherStuff();
        return () => {
          doThatBefore();
          doMoreOfThatBefore();
          if (x) {
            doThisMore()
          }
          document.removeEventListener("keydown", handleUserKeyPress);
          doThatAfter();
          doMoreOfThatAfter();
        };
      }, [])`,
  `useEffect(() => {
        doThis();
        doMoreOfThis();
        if (x) {
          doThisMore()
        }
        domElement.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        doSomeOtherStuff();
        return () => {
          doThatBefore();
          doMoreOfThatBefore();
          if (x) {
            doThisMore()
          }
          domElement.removeEventListener("keydown", handleUserKeyPress);
          doThatAfter();
          doMoreOfThatAfter();
        };
      }, [])`,
];

const invalids = [
  {
    // window.document - inline-if - no-conditional-addeventlistener
    code: `useEffect(() => {
          doThis();
          if (x) window.document.addEventListener("keydown", handleUserKeyPress);
        }, [])`,
    errors: [
      {
        messageId: "no-conditional-addeventlistener",
      },
    ],
  },
  {
    // window.document - ternary - consequent - no-conditional-addeventlistener
    code: `useEffect(() => {
          doThis();
          x && window.document.addEventListener("keydown", handleUserKeyPress);
        }, [])`,
    errors: [
      {
        messageId: "no-conditional-addeventlistener",
      },
    ],
  },
  {
    // window.document - ternary - alternate - no-conditional-addeventlistener
    code: `useEffect(() => {
          doThis();
          x ? window.document.addEventListener("keydown", handleUserKeyPress) : x();
        }, [])`,
    errors: [
      {
        messageId: "no-conditional-addeventlistener",
      },
    ],
  },
  {
    // window.document - if - no-conditional-addeventlistener
    code: `useEffect(() => {
          doThis();
          if (x) {
            window.document.addEventListener("keydown", handleUserKeyPress);
          }
        }, [])`,
    errors: [
      {
        messageId: "no-conditional-addeventlistener",
      },
    ],
  },
  {
    // window.document - else - no-conditional-addeventlistener
    code: `useEffect(() => {
          doThis();
          if (x) {
            x()
          } else {
            window.document.addEventListener("keydown", handleUserKeyPress);
          }
        }, [])`,
    errors: [
      {
        messageId: "no-conditional-addeventlistener",
      },
    ],
  },
  {
    // window.document - && - no-conditional-addeventlistener
    code: `useEffect(() => {
          doThis();
            x && window.document.addEventListener("keydown", handleUserKeyPress);
        }, [])`,
    errors: [
      {
        messageId: "no-conditional-addeventlistener",
      },
    ],
  },
  {
    // window.document - required-cleanup
    code: `useEffect(() => {
          doThis();
          if (x) {
            doThisMore()
          }
          window.document.addEventListener("keydown", handleUserKeyPress);
        }, [])`,
    errors: [
      {
        messageId: "required-cleanup",
      },
    ],
  },
  {
    // window.document - required-remove-eventListener
    code: `useEffect(() => {
          doThis();
          if (x) {
            doThisMore()
          }
          window.document.addEventListener("keydown", handleUserKeyPress);
          doMoreOfThis();
          return () => {
            if (x) {
              doThisMore()
            }
            doThatAfter();
          };
        }, [])`,
    errors: [
      {
        messageId: "required-remove-eventListener",
      },
    ],
  },
  {
    // document - required-cleanup
    code: `useEffect(() => {
          doThis();
          if (x) {
            doThisMore()
          }
          document.addEventListener("keydown", handleUserKeyPress);
          doOtherStuff();
        }, [])`,
    errors: [
      {
        messageId: "required-cleanup",
      },
    ],
  },
  {
    // document - required-remove-eventListener
    code: `useEffect(() => {
          doThis();
          if (x) {
            doThisMore()
          }
          document.addEventListener("keydown", handleUserKeyPress);
          doOtherStuff();
          return () => {
            if (x) {
              doThisMore()
            }
            doThatAfter();
          };
        }, [])`,
    errors: [
      {
        messageId: "required-remove-eventListener",
      },
    ],
  },
  {
    // document - if - no-conditional-addeventlistener
    code: `useEffect(() => {
          doThis();
          if (x) {
            document.addEventListener("keydown", handleUserKeyPress);
          }
        }, [])`,
    errors: [
      {
        messageId: "no-conditional-addeventlistener",
      },
    ],
  },
  {
    // document - && - no-conditional-addeventlistener
    code: `useEffect(() => {
          doThis();
            x && document.addEventListener("keydown", handleUserKeyPress);
        }, [])`,
    errors: [
      {
        messageId: "no-conditional-addeventlistener",
      },
    ],
  },
  {
    // window - required-cleanup
    code: `useEffect(() => {
        doThis();
        doMoreOfThis();
        if (x) {
          doThisMore()
        }
        window.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        doSomeOtherStuff();
      }, [])`,
    errors: [
      {
        messageId: "required-cleanup",
      },
    ],
  },
  {
    // window - required-remove-eventListener
    code: `useEffect(() => {
        doThis();
        doMoreOfThis();
        if (x) {
          doThisMore()
        }
        window.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        doSomeOtherStuff();
        return () => {
          doThat();
          doMoreOfThat();
        };
      }, [])`,
    errors: [
      {
        messageId: "required-remove-eventListener",
      },
    ],
  },
  {
    // window - if - no-conditional-addeventlistener
    code: `useEffect(() => {
          doThis();
          if (x) {
            window.addEventListener("keydown", handleUserKeyPress);
          }
        }, [])`,
    errors: [
      {
        messageId: "no-conditional-addeventlistener",
      },
    ],
  },
  {
    // window - && - no-conditional-addeventlistener
    code: `useEffect(() => {
          doThis();
            x && window.addEventListener("keydown", handleUserKeyPress);
        }, [])`,
    errors: [
      {
        messageId: "no-conditional-addeventlistener",
      },
    ],
  },
  {
    // content - required-cleanup
    code: `useEffect(() => {
        doMoreOfThis();
        const content = window;
        if (x) {
          doThisMore()
        }
        content.addEventListener("keydown", handleUserKeyPress);
        doSomeOtherStuff();
      }, [])`,
    errors: [
      {
        messageId: "required-cleanup",
      },
    ],
  },
  {
    // content - required-remove-eventListener
    code: `useEffect(() => {
        doMoreOfThis();
        const content = window;
        if (x) {
          doThisMore()
        }
        content.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        return () => {
          doMoreOfThat();
        };
      }, [])`,
    errors: [
      {
        messageId: "required-remove-eventListener",
      },
    ],
  },
  {
    // content - if - no-conditional-addeventlistener
    code: `useEffect(() => {
          doThis();
          const content = window;
          if (x) {
            content.addEventListener("keydown", handleUserKeyPress);
          }
        }, [])`,
    errors: [
      {
        messageId: "no-conditional-addeventlistener",
      },
    ],
  },
  {
    // content - && - no-conditional-addeventlistener
    code: `useEffect(() => {
          doThis();
            x && content.addEventListener("keydown", handleUserKeyPress);
        }, [])`,
    errors: [
      {
        messageId: "no-conditional-addeventlistener",
      },
    ],
  },
  // window.addEventListener X 2 - required-remove-eventListener
  {
    code: `useEffect(() => {
        doThis();
        doMoreOfThis();
        if (x) {
          doThisMore()
        }
        window.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        doSomeOtherStuff();
        return () => {
          doThat();
          window.addEventListener("keydown", handleUserKeyPress);
          doMoreOfThat();
        };
      }, [])`,
    errors: [
      {
        messageId: "required-remove-eventListener",
      },
    ],
  },
  // document.addEventListener X 2 - required-remove-eventListener
  {
    code: `useEffect(() => {
        doThis();
        doMoreOfThis();
        if (x) {
          doThisMore()
        }
        document.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        doSomeOtherStuff();
        return () => {
          doThat();
          document.addEventListener("keydown", handleUserKeyPress);
          doMoreOfThat();
        };
      }, [])`,
    errors: [
      {
        messageId: "required-remove-eventListener",
      },
    ],
  },
  // window.document.addEventListener X 2 - required-remove-eventListener
  {
    code: `useEffect(() => {
        doThis();
        doMoreOfThis();
        if (x) {
          doThisMore()
        }
        window.document.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        doSomeOtherStuff();
        return () => {
          doThat();
          window.document.addEventListener("keydown", handleUserKeyPress);
          doMoreOfThat();
        };
      }, [])`,
    errors: [
      {
        messageId: "required-remove-eventListener",
      },
    ],
  },
] as const;

it("ensure-matching-remove-event-listener", () => {
  const ruleTester: RuleTester = new RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
  });

  ruleTester.run(RULE_NAME, rule, {
    valid: valids,
    invalid: invalids,
  });
});
