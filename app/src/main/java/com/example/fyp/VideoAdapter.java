package com.example.fyp;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.util.List;

public class VideoAdapter extends RecyclerView.Adapter<VideoAdapter.VideoViewHolder> {
    private List<Video> videos;
    private OnItemClickListener listener;

    public interface OnItemClickListener {
        void onItemClick(Video video);
    }

    public VideoAdapter(List<Video> videos, OnItemClickListener listener) {
        this.videos = videos;
        this.listener = listener;
    }

    @NonNull
    @Override
    public VideoViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_video, parent, false);
        return new VideoViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull VideoViewHolder holder, int position) {
        Video video = videos.get(position);
        holder.tvTitle.setText(video.getTitle());
        holder.tvDuration.setText(video.getDuration());
        holder.tvDifficulty.setText(video.getDifficulty());
        holder.ivThumbnail.setImageResource(video.getThumbnailResId());

        holder.itemView.setOnClickListener(v -> listener.onItemClick(video));
    }

    @Override
    public int getItemCount() {
        return videos.size();
    }

    static class VideoViewHolder extends RecyclerView.ViewHolder {
        TextView tvTitle, tvDuration, tvDifficulty;
        ImageView ivThumbnail;

        public VideoViewHolder(@NonNull View itemView) {
            super(itemView);
            tvTitle = itemView.findViewById(R.id.tvTitle);
            tvDuration = itemView.findViewById(R.id.tvDuration);
            tvDifficulty = itemView.findViewById(R.id.tvDifficulty);
            ivThumbnail = itemView.findViewById(R.id.ivThumbnail);
        }
    }
}