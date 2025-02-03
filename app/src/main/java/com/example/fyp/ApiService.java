package com.example.fyp;

import com.google.gson.JsonObject;

import java.util.List;
import java.util.Map;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.Headers;
import retrofit2.http.POST;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface ApiService {
    @POST("api/register")  // 改用 @Body 而唔係 @FormUrlEncoded
    Call<ResponseBody> registerUser(@Body RegisterRequest request);

    @POST("api/login")
    Call<LoginResponse> loginUser(@Body LoginRequest loginRequest);

    @POST("api/createPlan")
    Call<CreatePlanResponse> createPlan(@Body AddPlanRequest request);

    @POST("api/assignPlan")
    Call<ResponseBody> assignPlan(@Body AssignPlanRequest request);

    @POST("api/user/plans")
    Call<List<PlanResponse>> getUserPlans(@Body UserIdRequest request);

    @POST("api/plan/videos")
    Call<List<VideoResponse>> getPlanVideos(@Body PlanIdRequest planIdRequest);
}