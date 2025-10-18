import { run } from "eslint-vitest-rule-tester";
import typescriptParser from "@typescript-eslint/parser";
import rule from "./valid-event-listener";

await run({
  name: "valid-event-listener - {requireUseEventListenerHook: false}",
  rule,
  languageOptions: {
    parser: typescriptParser,
  },
  valid: [
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
      options: [{ requireUseEventListenerHook: false }],
    },
    {
      code: `useEffect(() => {
        refcurrent = value;
      }, [value]);`,
      options: [{ requireUseEventListenerHook: false }],
    },
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
      options: [{ requireUseEventListenerHook: false }],
    },
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
      options: [{ requireUseEventListenerHook: false }],
    },
    {
      code: `useEffect(() => {
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
      options: [{ requireUseEventListenerHook: false }],
    },
  ],
  invalid: [
    {
      // window.document - inline-if - no-conditional-addeventlistener
      code: `useEffect(() => {
          doThis();
          if (x) window.document.addEventListener("keydown", handleUserKeyPress);
        }, [])`,
      options: [{ requireUseEventListenerHook: false }],
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
      options: [{ requireUseEventListenerHook: false }],
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
      options: [{ requireUseEventListenerHook: false }],
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
      options: [{ requireUseEventListenerHook: false }],
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
      options: [{ requireUseEventListenerHook: false }],
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
      options: [{ requireUseEventListenerHook: false }],
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
      options: [{ requireUseEventListenerHook: false }],
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
      options: [{ requireUseEventListenerHook: false }],
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
      options: [{ requireUseEventListenerHook: false }],
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
      options: [{ requireUseEventListenerHook: false }],
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
      options: [{ requireUseEventListenerHook: false }],
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
      options: [{ requireUseEventListenerHook: false }],
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
      options: [{ requireUseEventListenerHook: false }],
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
      options: [{ requireUseEventListenerHook: false }],
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
      options: [{ requireUseEventListenerHook: false }],
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
      options: [{ requireUseEventListenerHook: false }],
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
      options: [{ requireUseEventListenerHook: false }],
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
      options: [{ requireUseEventListenerHook: false }],
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
      options: [{ requireUseEventListenerHook: false }],
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
      options: [{ requireUseEventListenerHook: false }],
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
      options: [{ requireUseEventListenerHook: false }],
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
      options: [{ requireUseEventListenerHook: false }],
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
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: "required-remove-eventListener",
        },
      ],
    },
  ],
});

await run({
  name: "valid-event-listener - {requireUseEventListenerHook: true}",
  rule,
  languageOptions: {
    parser: typescriptParser,
  },
  valid: [
    {
      code: `
      useEventListener('scroll', onScroll)
      useEventListener('visibilitychange', onVisibilityChange, documentRef)
      useEventListener('click', onClick, buttonRef)
      `,
    },
    {
      code: `useEffect(() => {
        doThis();
        doMoreOfThis();
        if (x) {
          doThisMore()
        }
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
    },
  ],
  invalid: [
    {
      code: `
      useEffect(() => {
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
      errors: [
        {
          messageId: "require-use-event-listener-hook",
        },
      ],
    },
  ],
});

await run({
  name: "valid-event-listener - {requireUseEventListenerHook: false} - with once option",
  rule,
  languageOptions: {
    parser: typescriptParser,
  },
  valid: [
    {
      code: `useEffect(() => {
        window.addEventListener("keydown", handleUserKeyPress, { once: true });
      }, [])`,
      options: [{ requireUseEventListenerHook: false }],
    },
    {
      code: `useEffect(() => {
        document.addEventListener("click", handleClick, { once: true });
        window.addEventListener("scroll", handleScroll, { once: true });
      }, [])`,
      options: [{ requireUseEventListenerHook: false }],
    },
    {
      code: `useEffect(() => {
        const signal = AbortSignal.timeout(5000);
        window.addEventListener("abort", handleAbort, { once: true });
        return () => {
          // Optional: cleanup if needed
        };
      }, [])`,
      options: [{ requireUseEventListenerHook: false }],
    },
  ],
  invalid: [
    {
      code: `useEffect(() => {
        window.addEventListener("keydown", handleUserKeyPress);
        document.addEventListener("click", handleClick, { once: true });
      }, [])`,
      options: [{ requireUseEventListenerHook: false }],
      errors: [
        {
          messageId: "required-cleanup",
        },
      ],
    },
  ],
});
