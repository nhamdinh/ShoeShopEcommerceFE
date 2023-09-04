import React, { useEffect, useState } from "react";
import { useSendEmailMutation } from "../../store/components/auth/authApi";

const CalltoActionSection = () => {
  const [email, setemail] = useState<any>("");
  console.log(email);
  const [sendEmail, { isLoading, error }] = useSendEmailMutation();

  const onSendEmail = async (values: any) => {
    const res = await sendEmail(values);

    //@ts-ignore
    const data = res?.data;

    if (data) {
      console.log(data);
    } else {
    }
  };

  return (
    <div className="subscribe-section bg-with-black">
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className="subscribe-head">
              <h2>DO you need more tips?</h2>
              <p>Sign up free and get the latest tips.</p>
              <div className="form-section">
                <input
                  placeholder="Your Email..."
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e: any) => {
                    setemail(e.target.value);
                  }}
                />
                <input
                  onClick={() => {
                    onSendEmail({ email: email });
                  }}
                  value="Yes. I want!"
                  name="subscribe"
                  type="submit"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalltoActionSection;
