import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify
from flask_cors import CORS


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///C:/Users/kaoka/Desktop/BC/project2/Project-2/Resources/Spotify.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Top_fifty = Base.classes.top50_detail
All_year_top = Base.classes.top50_2019
world = Base.classes.SpotifyTopSongsByCountry

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
cors = CORS(app)

#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/top_50_2020_May<br/>"
        f"/api/v1.0/top_50_2019<br>"
        f"/api/v1.0/top50_country_2020_May"
    )


@app.route("/api/v1.0/top_50_2020_May")
def May():
    session = Session(engine)
    results = session.query(Top_fifty.Title, Top_fifty.popularity,Top_fifty.acousticness,Top_fifty.danceability,Top_fifty.energy, Top_fifty.instrumentalness,Top_fifty.loudness,Top_fifty.speechiness,Top_fifty.valence, Top_fifty.tempo).all()
    session.close()

    all_song = []
    count = 1
    for Title,popularity,acousticness,danceability,energy,instrumentalness, loudness, speechiness, valence, tempo in results:
        if Title:
            song_detail = {}
            song_detail["Title"] = Title
            song_detail["popularity"] = popularity
            song_detail["acousticness"] = acousticness
            song_detail["danceability"] = danceability
            song_detail["energy"] = energy
            song_detail["instrumentalness"] = instrumentalness
            song_detail["loudness"] = loudness
            song_detail["speechiness"] = speechiness
            song_detail["valence"] = valence
            song_detail["tempo"] = tempo
            song_detail["rank_in_May"] = count
            count+=1
            all_song.append(song_detail)
    return jsonify(all_song)

@app.route("/api/v1.0/top_50_2019")
def all_year():
    session = Session(engine)
    result = session.query(All_year_top.Title, All_year_top.Popularity,All_year_top.Acousticness,All_year_top.Danceability,All_year_top.Energy, All_year_top.Liveness,All_year_top.Loudness,All_year_top.Speechiness,All_year_top.Valence, All_year_top.BPM, All_year_top.Rank).all()
    session.close()
    all_song = []

    for Title,popularity,acousticness,danceability,energy,liveness, loudness, speechiness, valence, BPM, rank in result:
        if Title:
            song_detail = {}
            song_detail["Title"] = Title
            song_detail["popularity"] = popularity
            song_detail["acousticness"] = acousticness
            song_detail["danceability"] = danceability
            song_detail["energy"] = energy
            song_detail["liveness"] = liveness
            song_detail["loudness"] = loudness
            song_detail["speechiness"] = speechiness
            song_detail["valence"] = valence
            song_detail["BPM"] = BPM
            song_detail["Rank"] = rank
            all_song.append(song_detail)
    return jsonify(all_song)


@app.route("/api/v1.0/top50_country_2020_May")
def world_May():
    session = Session(engine)
    world_top = session.query(world.Country, world.Rank, world.Title, world.Artists, world.Album).all()
    session.close()

    all_world = []
    country_rank = {}
    for country, rank, title, artists, album in world_top:
        if country not in country_rank:
            country_rank[country] = []
        song_detail = {}
        song_detail["Rank"] = rank
        song_detail["Title"] = title
        song_detail["Artists"] = artists
        song_detail["Album"] = album
        country_rank[country].append(song_detail)
    all_world.append(country_rank)


    return jsonify(all_world)


if __name__ == '__main__':
    app.run(debug=True)
