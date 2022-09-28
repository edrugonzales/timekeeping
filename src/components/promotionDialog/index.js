import React from "react"
import { Dialog } from "@material-ui/core"
import InfoIcon from "@material-ui/icons/Info"
import CloseIcon from "@material-ui/icons/Close"
import { IconButton } from "@material-ui/core"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { useState } from "react";
// = {
//   component: "image",
//   description: "",
//   image: {
//     alt: "",
//     copyright: "",
//     fieldtype: "asset",
//     filename:
//       "https://a.storyblok.com/f/95100/820x360/eec984f7f4/kabayanijuan-covers.png",
//     focus: null,
//     id: 2375054,
//     name: "",
//     title: "",
//   },
//   link: "https://www.facebook.com/SparkleStarPH/posts/342286620865878",
//   title: "KabayaNiJuan",
//   _uid: "93948527-45a2-4d41-9dbb-4240caba96d3",
// },

const PromotionDialog = ({ showDialog, promotion, onClose }) => {
  return (
    <div>
      <Dialog open={showDialog} onClose={onClose} fullWidth>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <IconButton>
            <a href={promotion?.link} target="_blank">
              <InfoIcon />
            </a>
          </IconButton>
          <IconButton
            onClick={() => {
              onClose()
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div
          style={{
            margin: "10px",
          }}
        >
          <LazyLoadImage
            style={{
              borderRadius: "10px",
            }}
            placeholder={<span>loading</span>}
            effect="blur"
            src={promotion?.image?.filename}
            alt={promotion?.title}
            width="100%"
          />
          <h2 style = {{
            fontFamily: 'visby'
          }}>{promotion?.title}</h2>
          <p style = {{fontFamily: 'visby'}}>{promotion?.description}</p>
        </div>
      </Dialog>
    </div>
  )
}

export default PromotionDialog
