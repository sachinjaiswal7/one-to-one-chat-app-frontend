import { PiVideoCameraFill } from "react-icons/pi";
import { HiUserAdd } from "react-icons/hi";
import { SlOptions } from "react-icons/sl";
import { IoMdAttach } from "react-icons/io";
import { PiFilePlusThin } from "react-icons/pi";
import Message from "./Message";
const MainBar = ({
  chatData,
  sendMessageHandler,
  chatIncrement,
  setChatIncrement,
  refToClickedPeople,
  chatBottomRef,
  currentChaterDetail,
  me,
  setRefToClickedPeople
}) => {
 
  return (
   (
        <div className="main-bar-container">
          {(refToClickedPeople) ?<> <div className="main-bar-top">
            <div style={{fontWeight:900}}>{(currentChaterDetail) ? currentChaterDetail.name : null}</div>
            <PiVideoCameraFill />
            <HiUserAdd />
            <SlOptions />
          </div>
          <div className="main-bar-middle">
            {chatData && chatData.message && chatData.message.length > 0 ? (
              chatData.message.map((item, index) => {
                return (
                  <Message
                    key={index}
                    user={
                      item.whoSentIt.toString() === chatData.from.toString()
                        ? "me"
                        : "other"
                    }
                    message={item.text}
                    imageUrl={(item.whoSentIt.toString() === chatData.from.toString()) ? (me) ?  me.photoUrl: null : (currentChaterDetail) ?  currentChaterDetail.photoUrl: null}
                  />
                );
              })
            ) : (
              <h1 style={{ textAlign: "center", fontWeight: 300 }}>
                No chats are there
              </h1>
            )}
            <div ref={chatBottomRef} className="empty_div"></div>
          </div>
          <form
            onSubmit={(e) => {
              sendMessageHandler(
                e,
                chatIncrement,
                setChatIncrement,
                refToClickedPeople,
                chatBottomRef
              );
            }}
            className="main-bar-bottom"
          >
            <input
              type="text"
              className="chat-input"
              placeholder="Type Something..."
            />
            <IoMdAttach />
            <input type="file" id="file" style={{ display: "none" }} />
            <label
              htmlFor="file"
              style={{ display: "flex", alignItems: "center" }}
            >
              <PiFilePlusThin />
            </label>
            <button>Send</button>
          </form> </>: <div className="empty-div"><div>Choose a user to talk with</div></div>}
        </div>
      )
  );
};

export default MainBar;
