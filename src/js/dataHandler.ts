import * as d3 from "d3";

export default function(dataUrl) {

	let data;
	let callback;
	let centerNode;
	let filterFunc;
	const targetNodeCount = 20;
	const targetAverageValue = .2;
	const targetCurve = [
		1,
		0.707,
		0.693,
		0.679,
		0.643,
		0.607,
		0.571,
		0.514,
		0.429,
		0.357,
		0.3,
		0.25,
		0.221,
		0.2,
		0.179,
		0.157,
		0.136,
		0.121,
		0.107,
		0.093,
		0.079,
		0.064,
		0.05,
		0.043,
		0.029
	];

	function loadData(dataUrl) {
		if (!dataUrl) return;
		// Asynchronous call:
		console.log("dataHandler: Calling REST API");
		parseData(JSON.parse(`{
  "records": [
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "203944",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-25T21:08:50.904000000Z",
              "content": "appearance"
            }
          },
          {
            "identity": "203943",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-25T21:08:50.904000000Z",
              "content": "The upshot, then, of what i have to say is this: i am telling you to be a slow-speaking person."
            }
          }
        ],
        [
          {
            "identity": "1031518",
            "start": "203944",
            "end": "203943",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-25T21:08:50.904000000Z",
              "content": "appearance"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "203945",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-25T21:08:50.904000000Z",
              "content": "communication"
            }
          },
          {
            "identity": "203943",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-25T21:08:50.904000000Z",
              "content": "The upshot, then, of what i have to say is this: i am telling you to be a slow-speaking person."
            }
          }
        ],
        [
          {
            "identity": "1031519",
            "start": "203945",
            "end": "203943",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-25T21:08:50.904000000Z",
              "content": "communication"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "203969",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-17T15:14:48.759000000Z",
              "content": "game"
            }
          },
          {
            "identity": "203968",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-17T15:14:48.759000000Z",
              "content": "Instead of complaining about the downside of human nature, find ways to benefit from it. Instead of complaining about the rules, just learn the game, then play it."
            }
          }
        ],
        [
          {
            "identity": "1031444",
            "start": "203969",
            "end": "203968",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-17T15:14:48.759000000Z",
              "content": "game"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "203981",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-26T15:19:56.184000000Z",
              "content": "decisions"
            }
          },
          {
            "identity": "203968",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-17T15:14:48.759000000Z",
              "content": "Instead of complaining about the downside of human nature, find ways to benefit from it. Instead of complaining about the rules, just learn the game, then play it."
            }
          }
        ],
        [
          {
            "identity": "1031443",
            "start": "203981",
            "end": "203968",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-17T15:14:48.759000000Z",
              "content": "decisions"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "203970",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-17T15:14:48.759000000Z",
              "content": "idea-of-man"
            }
          },
          {
            "identity": "203968",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-17T15:14:48.759000000Z",
              "content": "Instead of complaining about the downside of human nature, find ways to benefit from it. Instead of complaining about the rules, just learn the game, then play it."
            }
          }
        ],
        [
          {
            "identity": "1031445",
            "start": "203970",
            "end": "203968",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-17T15:14:48.759000000Z",
              "content": "idea-of-man"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "203981",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-26T15:19:56.184000000Z",
              "content": "decisions"
            }
          },
          {
            "identity": "203972",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-17T16:02:20.586000000Z",
              "content": "I just bumped along and did what looked interesting. For me, that worked out fine."
            }
          }
        ],
        [
          {
            "identity": "1031448",
            "start": "203981",
            "end": "203972",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-17T16:02:20.586000000Z",
              "content": "decisions"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "203973",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-17T16:02:20.586000000Z",
              "content": "life"
            }
          },
          {
            "identity": "203972",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-17T16:02:20.586000000Z",
              "content": "I just bumped along and did what looked interesting. For me, that worked out fine."
            }
          }
        ],
        [
          {
            "identity": "1031449",
            "start": "203973",
            "end": "203972",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-17T16:02:20.586000000Z",
              "content": "life"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "203976",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-17T18:00:39.001000000Z",
              "content": "privacy"
            }
          },
          {
            "identity": "203975",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-17T18:00:39.001000000Z",
              "content": "Arguing that you don't care about the right to privacy because you have nothing to hide is no different than saying you don't care about free speech because you have nothing to say."
            }
          }
        ],
        [
          {
            "identity": "1031452",
            "start": "203976",
            "end": "203975",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-17T18:00:39.001000000Z",
              "content": "privacy"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "203981",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-26T15:19:56.184000000Z",
              "content": "decisions"
            }
          },
          {
            "identity": "203978",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-26T15:19:56.184000000Z",
              "content": "OODA: Observe, orient, decide, act (military origin)"
            }
          }
        ],
        [
          {
            "identity": "1031455",
            "start": "203981",
            "end": "203978",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-26T15:19:56.184000000Z",
              "content": "decisions"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "203979",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-26T15:19:56.184000000Z",
              "content": "project-management"
            }
          },
          {
            "identity": "203978",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-26T15:19:56.184000000Z",
              "content": "OODA: Observe, orient, decide, act (military origin)"
            }
          }
        ],
        [
          {
            "identity": "1031456",
            "start": "203979",
            "end": "203978",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-26T15:19:56.184000000Z",
              "content": "project-management"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "203981",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-26T15:19:56.184000000Z",
              "content": "decisions"
            }
          },
          {
            "identity": "203983",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-15T11:03:30.699000000Z",
              "content": "Obvious decisions (robust to error) require no more than a single reason. Likewise the French army had a heuristic to reject excuses for absenteeism for more than one reason."
            }
          }
        ],
        [
          {
            "identity": "1031494",
            "start": "203981",
            "end": "203983",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-15T11:03:30.699000000Z",
              "content": "decisions"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "203982",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-15T11:03:30.699000000Z",
              "content": "antifragile"
            }
          },
          {
            "identity": "203983",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-15T11:03:30.699000000Z",
              "content": "Obvious decisions (robust to error) require no more than a single reason. Likewise the French army had a heuristic to reject excuses for absenteeism for more than one reason."
            }
          }
        ],
        [
          {
            "identity": "1031493",
            "start": "203982",
            "end": "203983",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-15T11:03:30.699000000Z",
              "content": "antifragile"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "203994",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-15T11:00:52.565000000Z",
              "content": "innovation"
            }
          },
          {
            "identity": "203992",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-15T10:59:06.240000000Z",
              "content": "The Future is already here, it’s just not evenly distributed."
            }
          }
        ],
        [
          {
            "identity": "1031482",
            "start": "203994",
            "end": "203992",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-15T10:59:06.240000000Z",
              "content": "innovation"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "203993",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-15T10:59:06.240000000Z",
              "content": "future"
            }
          },
          {
            "identity": "203992",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-15T10:59:06.240000000Z",
              "content": "The Future is already here, it’s just not evenly distributed."
            }
          }
        ],
        [
          {
            "identity": "1031481",
            "start": "203993",
            "end": "203992",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-15T10:59:06.240000000Z",
              "content": "future"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "203994",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-15T11:00:52.565000000Z",
              "content": "innovation"
            }
          },
          {
            "identity": "203997",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-15T11:00:52.565000000Z",
              "content": "He found that the inventors […] were not specialists. They were polymaths, people with one area of depth, but a great deal of expertise in other areas as well."
            }
          }
        ],
        [
          {
            "identity": "1031486",
            "start": "203994",
            "end": "203997",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-15T11:00:52.565000000Z",
              "content": "innovation"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "203998",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-15T11:01:40.724000000Z",
              "content": "polymath"
            }
          },
          {
            "identity": "203997",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-15T11:00:52.565000000Z",
              "content": "He found that the inventors […] were not specialists. They were polymaths, people with one area of depth, but a great deal of expertise in other areas as well."
            }
          }
        ],
        [
          {
            "identity": "1031485",
            "start": "203998",
            "end": "203997",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-15T11:00:52.565000000Z",
              "content": "polymath"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "203998",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-15T11:01:40.724000000Z",
              "content": "polymath"
            }
          },
          {
            "identity": "204001",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-15T11:01:40.724000000Z",
              "content": "Wider die Natur entwickelt sich der Mensch zu einem Multitasking-Wesen. Dabei fällt es vielen Menschen ja schon schwer, sich überhaupt auf irgendetwas zu konzentrieren."
            }
          }
        ],
        [
          {
            "identity": "1031490",
            "start": "203998",
            "end": "204001",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-15T11:01:40.724000000Z",
              "content": "polymath"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "204309",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-15T11:01:40.724000000Z",
              "content": "focus"
            }
          },
          {
            "identity": "204001",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-15T11:01:40.724000000Z",
              "content": "Wider die Natur entwickelt sich der Mensch zu einem Multitasking-Wesen. Dabei fällt es vielen Menschen ja schon schwer, sich überhaupt auf irgendetwas zu konzentrieren."
            }
          }
        ],
        [
          {
            "identity": "1031489",
            "start": "204309",
            "end": "204001",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-15T11:01:40.724000000Z",
              "content": "focus"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "203981",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-26T15:19:56.184000000Z",
              "content": "decisions"
            }
          },
          {
            "identity": "204017",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-15T11:04:04.644000000Z",
              "content": "The secret to doing good research is always to be a little underemployed. You waste years by not being able to waste hours."
            }
          }
        ],
        [
          {
            "identity": "1031498",
            "start": "203981",
            "end": "204017",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-15T11:04:04.644000000Z",
              "content": "decisions"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "204018",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-15T11:04:04.644000000Z",
              "content": "basics"
            }
          },
          {
            "identity": "204017",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-15T11:04:04.644000000Z",
              "content": "The secret to doing good research is always to be a little underemployed. You waste years by not being able to waste hours."
            }
          }
        ],
        [
          {
            "identity": "1031497",
            "start": "204018",
            "end": "204017",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-15T11:04:04.644000000Z",
              "content": "basics"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "204021",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-16T12:24:28.353000000Z",
              "content": "talks"
            }
          },
          {
            "identity": "204020",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-16T12:24:28.353000000Z",
              "content": "With scientific books the money isn’t in the books but in talking."
            }
          }
        ],
        [
          {
            "identity": "1031501",
            "start": "204021",
            "end": "204020",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-16T12:24:28.353000000Z",
              "content": "talks"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "204022",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-16T12:24:28.353000000Z",
              "content": "income"
            }
          },
          {
            "identity": "204020",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-16T12:24:28.353000000Z",
              "content": "With scientific books the money isn’t in the books but in talking."
            }
          }
        ],
        [
          {
            "identity": "1031502",
            "start": "204022",
            "end": "204020",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-16T12:24:28.353000000Z",
              "content": "income"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "204028",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-16T12:34:09.404000000Z",
              "content": "complexity"
            }
          },
          {
            "identity": "204026",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-16T12:34:09.404000000Z",
              "content": "Thinkism: you often get that with middle-aged guys who like to think they can figure out things by thinking about them [...]. Complex things like technology [...] we can only figure out by engaging in them. Unless you engage with technology you can’t steer it."
            }
          }
        ],
        [
          {
            "identity": "1031506",
            "start": "204028",
            "end": "204026",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-16T12:34:09.404000000Z",
              "content": "complexity"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "204029",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-16T12:37:16.899000000Z",
              "content": "iterative"
            }
          },
          {
            "identity": "204026",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-16T12:34:09.404000000Z",
              "content": "Thinkism: you often get that with middle-aged guys who like to think they can figure out things by thinking about them [...]. Complex things like technology [...] we can only figure out by engaging in them. Unless you engage with technology you can’t steer it."
            }
          }
        ],
        [
          {
            "identity": "1031507",
            "start": "204029",
            "end": "204026",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-16T12:34:09.404000000Z",
              "content": "iterative"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "204027",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-16T12:34:09.404000000Z",
              "content": "technology"
            }
          },
          {
            "identity": "204026",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-16T12:34:09.404000000Z",
              "content": "Thinkism: you often get that with middle-aged guys who like to think they can figure out things by thinking about them [...]. Complex things like technology [...] we can only figure out by engaging in them. Unless you engage with technology you can’t steer it."
            }
          }
        ],
        [
          {
            "identity": "1031505",
            "start": "204027",
            "end": "204026",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-16T12:34:09.404000000Z",
              "content": "technology"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "204031",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-16T12:37:16.899000000Z",
              "content": "epistemology"
            }
          },
          {
            "identity": "204030",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-16T12:37:16.899000000Z",
              "content": "Three kinds if generating knowledge: humanities (thinking about it, tell stories); science (experiments); nerds (making things). Nerd culture as „Third Culture“"
            }
          }
        ],
        [
          {
            "identity": "1031510",
            "start": "204031",
            "end": "204030",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-16T12:37:16.899000000Z",
              "content": "epistemology"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "204029",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-16T12:37:16.899000000Z",
              "content": "iterative"
            }
          },
          {
            "identity": "204030",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-16T12:37:16.899000000Z",
              "content": "Three kinds if generating knowledge: humanities (thinking about it, tell stories); science (experiments); nerds (making things). Nerd culture as „Third Culture“"
            }
          }
        ],
        [
          {
            "identity": "1031511",
            "start": "204029",
            "end": "204030",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-16T12:37:16.899000000Z",
              "content": "iterative"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "204075",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-26T19:20:23.188000000Z",
              "content": "model"
            }
          },
          {
            "identity": "204072",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-26T19:20:23.188000000Z",
              "content": "All religions are wrong but some religions are useful ;)"
            }
          }
        ],
        [
          {
            "identity": "1031560",
            "start": "204075",
            "end": "204072",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-26T19:20:23.188000000Z",
              "content": "model"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "204074",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-26T19:20:23.188000000Z",
              "content": "dogma"
            }
          },
          {
            "identity": "204072",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-26T19:20:23.188000000Z",
              "content": "All religions are wrong but some religions are useful ;)"
            }
          }
        ],
        [
          {
            "identity": "1031559",
            "start": "204074",
            "end": "204072",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-26T19:20:23.188000000Z",
              "content": "dogma"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    },
    {
      "keys": [
        "nodes",
        "rels"
      ],
      "length": 2,
      "_fields": [
        [
          {
            "identity": "204073",
            "labels": [
              "Label"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-26T19:20:23.188000000Z",
              "content": "Religion"
            }
          },
          {
            "identity": "204072",
            "labels": [
              "Citation"
            ],
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "language": "de",
              "created_on": "2020-08-26T19:20:23.188000000Z",
              "content": "All religions are wrong but some religions are useful ;)"
            }
          }
        ],
        [
          {
            "identity": "1031558",
            "start": "204073",
            "end": "204072",
            "type": "HAS_LABEL",
            "properties": {
              "uid": "auth0|5ec026be5c51d10be8f99fce",
              "created_on": "2020-08-26T19:20:23.188000000Z",
              "content": "Religion"
            }
          }
        ]
      ],
      "_fieldLookup": {
        "nodes": 0,
        "rels": 1
      }
    }
  ],
  "summary": {
    "query": {
      "text": "MATCH p=(n)-[r:HAS_LABEL]->(m) WHERE n.uid=$uid AND r.uid=$uid AND m.uid=$uid RETURN nodes(p) as nodes, rels(p) as rels",
      "parameters": {
        "uid": "auth0|5ec026be5c51d10be8f99fce"
      }
    },
    "queryType": "r",
    "counters": {
      "_stats": {
        "nodesCreated": 0,
        "nodesDeleted": 0,
        "relationshipsCreated": 0,
        "relationshipsDeleted": 0,
        "propertiesSet": 0,
        "labelsAdded": 0,
        "labelsRemoved": 0,
        "indexesAdded": 0,
        "indexesRemoved": 0,
        "constraintsAdded": 0,
        "constraintsRemoved": 0
      },
      "_systemUpdates": 0
    },
    "updateStatistics": {
      "_stats": {
        "nodesCreated": 0,
        "nodesDeleted": 0,
        "relationshipsCreated": 0,
        "relationshipsDeleted": 0,
        "propertiesSet": 0,
        "labelsAdded": 0,
        "labelsRemoved": 0,
        "indexesAdded": 0,
        "indexesRemoved": 0,
        "constraintsAdded": 0,
        "constraintsRemoved": 0
      },
      "_systemUpdates": 0
    },
    "plan": false,
    "profile": false,
    "notifications": [
      
    ],
    "server": {
      "address": "h2868353.stratoserver.net:7687",
      "version": "Neo4j/3.5.14",
      "protocolVersion": 3
    },
    "resultConsumedAfter": "263",
    "resultAvailableAfter": "0",
    "database": {
      "name": null
    }
  }
}`));
		return;
		d3.json(dataUrl).then(d => parseData(d));
	}

	function parseData(dataIn) {
		console.log("dataHandler: REST API response");
		if(!dataIn.records) return {};
		
		// Generic transfer of neo4j-structure to map of elements by type and id to have unique elements:
		let dataBuffer = {};
		for (let record of dataIn.records) {
			for (let key of record.keys) {
				let fieldIndex = record._fieldLookup[key];
				for (let field of record._fields[fieldIndex]) {
					if (!dataBuffer[key]) dataBuffer[key] = {};
					dataBuffer[key][field.identity] = field;
				}
			}
		}
		// Change object to array, change "rels" to "links":
		let dataOut = {};
		for (let keyIn in dataBuffer) {
			let keyOut = keyIn === "rels" ? "links" : "nodes";
			dataOut[keyOut] = [];
			for (let index in dataBuffer[keyIn]) {
				let elementIn = dataBuffer[keyIn][index];
				let elementOut = {};
				elementOut.id = index;
				elementOut.createdOn = new Date(elementIn.properties.created_on);
				// elementOut.createdOn = new Date(`${elementIn.properties.created_on.year.low}-${elementIn.properties.created_on.month.low}-${elementIn.properties.created_on.day.low}`);
				if (elementIn.start) {
					// Relations:
					elementOut.source = elementIn.start;
					elementOut.target = elementIn.end;
					elementOut.value = .9;
				}
				else {
					// Other elements, e.g. tags:
					elementOut.content = elementIn.properties.content;
					elementOut.type = elementIn.labels[0] === "Label" ? "tag" : elementIn.labels[0];
				}
				dataOut[keyOut].push(elementOut);
			}
		}
		// Replace link node IDd with references:
		for (let link of dataOut.links) {
			let source = dataOut.nodes.find(n => n.id === link.source);
			let target = dataOut.nodes.find(n => n.id === link.target);
			if (source && target) {
				link.source = source;
				link.target = target;
			}
			else {
				console.log("dataHandler: backend seems to deliver links without nodes.");
			}
		}
		console.log(dataOut);
		data = dataOut;
		let centeredData = dataHandler.recenter();
		callback(centeredData);
	}

	function dataHandler() {
		return data;
	}

	dataHandler.dataUrl = function(_) {
		if (_) loadData(_);
		return dataUrl;
	}

	dataHandler.callback = function(_) {
		if (_) callback = _;
		return dataHandler;
	}

	dataHandler.filter = function(_) {
		if (_) filterFunc = _;
		else filterFunc = null;
		return filterFunc;
	}

	dataHandler.search = function (searchString) {
		
		if (!data) return null;
		if (!searchString || searchString.length < 1) return {tags: data.nodes.filter(d => d.type === "tag"), citations: []};

		let result = {};
				
		result.citations = data.nodes.filter(d => d.type !== "tag" && d.content.toLowerCase().search(searchString.toLowerCase()) > -1);
		result.tags = data.nodes.filter(d => d.type === "tag" && d.content.toLowerCase().search(searchString.toLowerCase()) > -1)
		
		return result;
	}

	dataHandler.recenter = function (centerNodeIn) {

		if (centerNodeIn) {
			centerNode = centerNodeIn;
		}

		if (!data) return null;

		if (!centerNode) {
			centerNode = data.nodes[parseInt(Math.random() * data.nodes.length)];
		}
		
		centerNode.iteration = 0;
		let iteration = 1;
		centerNode.multipliedLinkValue = 1;
		let nodesAround = [centerNode];
		let linksAround = [];
		
		let foundIds = [centerNode.id];

		// Temporary dirty workaround expecting to go back to a fully-connected graph:
		// ###
		if(filterFunc) {
			const nodes = data.nodes.filter(filterFunc);
			nodes.forEach(n => n.renderValue = .7);
			console.log(nodes);
			return {nodes: nodes, links: []};
		}

		// Get the elements closest to source node:
		do {
			for (var node of nodesAround.filter(n => n.iteration === iteration - 1)) {
				const sourceLinks = data.links.filter(l => l.source.id === node.id);
				const targetLinks = data.links.filter(l => l.target.id === node.id);
				linksAround = linksAround.concat(sourceLinks).concat(targetLinks); // includes links to already found nodes
				const sourceLinkNodes = sourceLinks.map(l => Object.assign(l.target, {linkValue: l.value}));
				const targetLinkNodes = targetLinks.map(l => Object.assign(l.source, {linkValue: l.value}));
				let childNodes = [...sourceLinkNodes, ...targetLinkNodes].filter(n => !foundIds.some(f => f === n.id));
				// if (filterFunc) childNodes = childNodes.filter(n => filterFunc);
				childNodes.forEach(c => {
					c.iteration = iteration;
					c.multipliedLinkValue = node.multipliedLinkValue * c.linkValue / iteration;
				});
				foundIds = foundIds.concat(childNodes.map(n => n.id));
				nodesAround = nodesAround.concat(childNodes);
			}
			iteration++;
				
		} while (nodesAround.length < 50 && iteration < 10);

		// Stretch closest nodes' distances to better fit UI expectations:
		let nodesAroundSlice;
		while (true) {
			nodesAround.sort((a, b) => (a.multipliedLinkValue > b.multipliedLinkValue ? -1 : 1));
			nodesAroundSlice = nodesAround.slice(0, targetNodeCount)
			break;
		}
		let targetIntegralFactor = targetAverageValue / nodesAroundSlice.map(n => n.multipliedLinkValue).reduce((a, b) => a + b, 0) * nodesAroundSlice.length;
		for (let i in nodesAroundSlice) {
			// Adjust curve in direction of target curve to  add perspecitve:
			nodesAroundSlice[i].renderValue = (nodesAroundSlice[i].multipliedLinkValue + (targetCurve[i] || 0.01)) * 0.5
			// Adjust cuve in direction of weighted  total size:
			nodesAroundSlice[i].renderValue *= (1 + +i * 2 / nodesAroundSlice.length * (targetIntegralFactor - 1));
		}
		linksAround = linksAround.filter(l => nodesAroundSlice.some(n => n === l.source) && nodesAroundSlice.some(n => n === l.target));
		// Make unique:
		linksAround = [...new Set(linksAround.map(l => l.id))].map(id => linksAround.find(l => l.id === id));

		return {nodes: nodesAroundSlice, links: linksAround};
	}

	// ### Move to intro to better modularize. Add options here if neccessary

	// dataHandler.intro = (_ => {

	// 	let introData = {};

	// 	return function(step) {
	// 		// Can go back-and forth, must start with step 1:
	// 		console.log(step);
	// 		switch (step) {
	// 			case 0:
	// 				introData.nodes = [data.nodes.find(n => n.content === "Bill always counseled us to try to cut through those opinions and get to the heart of the matter.")];
	// 				introData.nodes[0].iteration = 0;
	// 				introData.nodes[0].renderValue = 1;
	// 				introData.links = [];
	// 				return introData;
	// 			case 1:
	// 				introData.nodes.push(data.nodes.find(n => n.content === "Decisions"))
	// 				introData.nodes[0].iteration = 1;
	// 				introData.nodes[1].iteration = 0;
	// 				introData.nodes[1].renderValue = 1;
	// 				introData.nodes[1].x = 1;
	// 				introData.nodes[1].y = 1;
	// 				return introData;
	// 			case 2:
	// 				return dataHandler.recenter(introData.nodes[1]);
	// 		}
	// 	}
	// })();

	return dataHandler;
}
















