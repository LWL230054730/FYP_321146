package com.example.fyp;

import com.google.gson.annotations.SerializedName;

public class UserData {
    @SerializedName("userId")
    private String userID;

    @SerializedName("userName")
    private String userName;

    @SerializedName("firstName")
    private String firstName;

    // Getter for userID
    public String getUserID() {
        return userID;
    }

    // Getter for userName
    public String getUserName() {
        return userName;
    }

    // Getter for firstName
    public String getFirstName() {
        return firstName;
    }
}