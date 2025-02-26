import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useEffect, useRef, useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 9fr;
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
  flex-grow: 1;
  min-width: 0;
  overflow-wrap: break-word;
  word-break: break-word;
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

const MoreButtonContainer = styled.div`
  position: relative; /* Dropdown 위치 기준 */
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: white;
  position: relative;
`;
const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: #333;
  border: 1px solid #555;
  border-radius: 5px;
  padding: 5px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;
const DropdownItem = styled.button`
  background: none;
  border: none;
  color: white;
  padding: 10px;
  width: 100px;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #555;
  }
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
const AvatarImg = styled.img`
  width: 60%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  posituin: relative;
`;

export default function Tweet({
  username,
  photo,
  tweet,
  userId,
  id,
  avatar,
}: ITweet) {
  const user = auth.currentUser;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTweet, setEditedTweet] = useState(tweet);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleMoreClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Wrapper>
      {avatar ? (
        <AvatarImg src={avatar} />
      ) : (
        <svg
          width="60%"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
        </svg>
      )}

      <Column>
        <Header>
          <Username>{username}</Username>
          {user?.uid === userId && (
            <MoreButtonContainer>
              <MoreButton onClick={handleMoreClick}>⋮</MoreButton>
              {showDropdown && (
                <Dropdown ref={dropdownRef}>
                  <DropdownItem onClick={() => setIsEditing(true)}>
                    Edit
                  </DropdownItem>
                  <DropdownItem onClick={onDelete}>Delete</DropdownItem>
                </Dropdown>
              )}
            </MoreButtonContainer>
          )}
        </Header>
        {isEditing ? (
          <>
            <TextArea value={editedTweet} onChange={handleInputChange} />
            <button onClick={onEdit}>Save</button>
            <button onClick={onCancel}>Cancel</button>
          </>
        ) : (
          <Payload>{tweet}</Payload>
        )}
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
}
