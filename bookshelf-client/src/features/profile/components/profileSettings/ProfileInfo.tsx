import "../../styles/profileInfoStyles.css";
import { useEffect } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks/redux";
import { UpdateProfileArgs } from "../../../../utils/api/profiles";
import {
  LoginState,
  updateUserInfo,
} from "../../../../store/slices/loginSlice";
import SubHeader from "../../../header/components/SubHeader";
import { useUpdateProfileInfo } from "../../hooks/useUpdateProfileInfo";
import { setMessage } from "../../../../store/slices/messageSlice";
import SettingsNav from "./SettingsNav";

const ProfileInfoPage = () => {
  const user: LoginState["user"] = useAppSelector((state) => state.login.user);
  let dispatch = useAppDispatch();

  const initialState: UpdateProfileArgs = {
    gender: user ? user.gender : null,
    birthday: user ? user.birthday : null,
    location: user ? user.location : null,
  };

  let [profileState, setInputs, updateProfileInfo] =
    useUpdateProfileInfo(initialState);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const inputName = event.target.name;
    const value = event.target.value;
    if (value || inputName !== "birthday") {
      setInputs((values) => ({ ...values, [inputName]: value }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProfileInfo();
  };

  useEffect(() => {
    if (profileState.profileInfo) {
      dispatch(updateUserInfo(profileState.profileInfo));
      dispatch(
        setMessage({
          content: "Profile info updated successfuly",
          variant: "Success",
        })
      );
    } else if (profileState.error) {
      dispatch(
        setMessage({
          content: `Oops! Couldn't update profile info. Please try again`,
          variant: "Danger",
        })
      );
    }
  }, [dispatch, profileState.error, profileState.profileInfo]);

  const birthdayDate: string | undefined =
    user && user.birthday
      ? new Date(user.birthday).toISOString().split("T")[0]
      : undefined;

  return (
    <div className="settings-info-page">
      <SubHeader
        title="Profile info"
        childComp={() => SettingsNav("info")}
        icon="fas fa-user-edit"
      ></SubHeader>
      <div className="form-container">
        <Form onSubmit={handleSubmit}>
          {user && (
            <div>
              <Form.Group className="mb-3" controlId="formGridGender">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  defaultValue={
                    user && user.gender ? user.gender : "non Specified"
                  }
                  name="gender"
                  onChange={(e) => handleChange(e)}
                >
                  <option>Non Specified</option>
                  <option>Male</option>
                  <option>Female</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formGridBirthday">
                <Form.Label>Birthdate</Form.Label>
                <Form.Control
                  defaultValue={birthdayDate}
                  id="datepicker"
                  type="date"
                  name="birthday"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e)
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formGridLocation">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  defaultValue={user && user.location ? user.location : ""}
                  placeholder=""
                  name="location"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e)
                  }
                />
              </Form.Group>
              <div>
                <Button variant="dark" type="submit" className="save-button">
                  Save changes
                </Button>
              </div>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default ProfileInfoPage;
