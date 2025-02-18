import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;
const Column = styled.div`
  &:last-child {
    place-self: end;
  }
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* 자동 확장 */
  min-width: 0; /* 너무 길어지는 것 방지 */
  overflow-wrap: break-word; /* 긴 단어도 줄바꿈 */
  word-break: break-word; /* 단어 단위로 줄바꿈 */
`;
const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;
const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;
const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;
const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 10px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  width: 60px;
`;
const EditButton = styled.button`
  background-color: gray;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 10px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  width: 60px;
`;
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const TextArea = styled.textarea`
  width: 100%;
  height: auto;
  font-size: 18px;
  border: none;
  outline: none;
  background: transparent;
  color: white;
  resize: none;
  padding: 5px;
  font-family: inherit;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTweet, setEditedTweet] = useState(tweet);

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };

  const onEdit = async () => {
    try {
      await updateDoc(doc(db, "tweets", id), {
        tweet: editedTweet,
      });
      setIsEditing(false);
    } catch (e) {
      console.log(e);
    }
  };

  const onCancel = async () => {
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedTweet(e.target.value);
    e.target.style.height = "auto"; // 높이를 초기화한 후
    e.target.style.height = `${e.target.scrollHeight}px`; // 내용에 맞게 조절
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {isEditing ? (
          <>
            <TextArea value={editedTweet} onChange={handleInputChange} />
            <button onClick={onEdit}>Save</button>
            <button onClick={onCancel}>Cancel</button>
          </>
        ) : (
          <Payload>{tweet}</Payload>
        )}
        {user?.uid === userId && (
          <ButtonContainer>
            <DeleteButton onClick={onDelete}>Delete</DeleteButton>
            <EditButton onClick={() => setIsEditing(true)}>Edit</EditButton>
          </ButtonContainer>
        )}
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
}
