import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./profile.css";
import axios from "axios";


function Profile() {
    const [profile, setProfile] = useState({});
    const user_id = localStorage.getItem("userId");
    const token = localStorage.getItem("authtoken");

    useEffect(() => {
        const dataprofile = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/profile/fetchprofile`,
                    {
                        params: { user_id }, //  sends ?user_id=abc123
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                response.data.fetchprofiledata.map((data, index) => {
                    //   console.log("profile data ", data);
                    setProfile(data);
                });
            } catch (error) {
                console.log("Error fetching profile data:", error);
            }
        };

        dataprofile();
    }, [user_id, token]);

    return <>
        <Navbar fixedTop={true} />

        <div class="container py-5">
            <div class="row">

                <div class="col-md-8 col-lg-9">
                    <div class="card shadow-sm mb-4">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0">Account Details</h5>
                        </div>
                        <div class="card-body">
                            <form class="needs-validation" novalidate>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="firstName" class="form-label">First Name</label>
                                        <input type="text" id="firstName" class="form-control" value={profile.full_name} required />
                                        <div class="valid-feedback">Looks good!</div>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="lastName" class="form-label">Last Name</label>
                                        <input type="text" id="lastName" class="form-control" value={profile.last_name} required />
                                        <div class="valid-feedback">Looks good!</div>
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="username" class="form-label" >Username</label>
                                        <div class="input-group has-validation">
                                            <span class="input-group-text">@</span>
                                            <input type="text" class="form-control" id="username" value={profile.full_name + profile.last_name} required />
                                            <div class="invalid-feedback">Please choose a username.</div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="email" class="form-label">Email Address</label>
                                        <input type="email" id="email" class="form-control" value={profile.email} required />
                                        <div class="invalid-feedback">Please provide a valid email.</div>
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="phone" class="form-label">Phone Number</label>
                                        <input type="text" id="phone" class="form-control" value={profile.mobile_no} required />
                                        <div class="invalid-feedback">Please provide a valid phone number.</div>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="dob" class="form-label">Date of Birth</label>
                                        <input type="date" id="dob" class="form-control" />
                                    </div>
                                </div>

                                <hr class="my-4" />

                                <h6 class="mb-3">Address Information</h6>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="city" class="form-label">City</label>
                                        <input type="text" id="city" class="form-control" required />
                                        <div class="invalid-feedback">Please provide a valid city.</div>
                                    </div>
                                    <div class="col-md-3">
                                        <label for="state" class="form-label">State</label>
                                        <select class="form-select" id="state" required>
                                            <option selected disabled value="">Choose...</option>
                                            <option>California</option>
                                            <option>New York</option>
                                            <option>Texas</option>
                                        </select>
                                        <div class="invalid-feedback">Please select a valid state.</div>
                                    </div>
                                    <div class="col-md-3">
                                        <label for="zip" class="form-label">Zip</label>
                                        <input type="text" id="zip" class="form-control" required />
                                        <div class="invalid-feedback">Please provide a valid zip.</div>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="address" class="form-label">Street Address</label>
                                    <input type="text" id="address" class="form-control" placeholder="1234 Main St" required />
                                    <div class="invalid-feedback">Please provide your street address.</div>
                                </div>

                                <hr class="my-4" />
                                <div class="form-check mb-3">
                                    <input class="form-check-input" type="checkbox" id="terms" required />
                                    <label class="form-check-label" for="terms">I agree to the terms and conditions</label>
                                    <div class="invalid-feedback">You must agree before submitting.</div>
                                </div>

                                <button type="submit" class="btn btn-primary">Save All Changes</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}
export default Profile;