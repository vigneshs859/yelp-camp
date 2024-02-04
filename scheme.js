const Basejoi=require("joi");
const sanitizeHTML=require("sanitize-html");
const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
      "string.escapeHTML": "{{#label}} must not include HTML!",
    },
    rules: {
      escapeHTML: {
        validate(value, helpers) {
          const clean = sanitizeHTML(value, {
            allowedTags: [],
            allowedAttributes: {},
          });
          if (clean !== value)
            return helpers.error("string.escapeHTML", { value });
          return clean;
        },
      },
    },
  });
   
  const joi = Basejoi.extend(extension);

module.exports.scheme=joi.object(
    {
        campground:joi.object({
            title:joi.string().required().escapeHTML(),
            price:joi.number().min(0).required(),
            location:joi.string().required().escapeHTML(),
            description:joi.string().required().escapeHTML(),
            //image:joi.string().required()
        }).required(),
        deleteImages:joi.array()
    }
    
)


module.exports.reviewScheme=joi.object(
    {
        review:joi.object(
            {
                body:joi.string().required().escapeHTML(),
                rating:joi.number().min(1).max(5).required()
            }
        ).required()
    }
)