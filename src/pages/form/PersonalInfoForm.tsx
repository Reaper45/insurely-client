import React from 'react'

import styled from "emotion";
import { Input } from "components/ui"

const InputGroup = styled("div")`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  @media (max-width: 767px) {
    flex-wrap: wrap;
    > div {
      padding: 0 !important;
    }
  }
  > div {
    width: 100%;
    flex: 1 1 auto;
    :first-of-type {
      padding-right: .5rem;
    }
    :last-of-type {
      padding-left: 0.5rem;
    }
  }
`;

const PersonalInfoForm = () => {
  return (
    <div>
      <InputGroup>
        <div>
          <Input type="text" name="fname" id="fname" placeholder="First Name" />
        </div>{" "}
        <div>
          <Input type="text" name="lname" id="lname" placeholder="Last Name" />
        </div>{" "}
      </InputGroup>

      <Input type="email" name="email" id="email" placeholder="Email address" />
      <Input
        type="text"
        name="phoneNumber"
        id="phoneNumber"
        placeholder="Phone number"
      />
    </div>
  );
}

export default PersonalInfoForm
