/*
  Steps
  =====
  * For each shingle length:
    * Get distances
    * Get best denominator
  * Get key lengths
  * For each key length:
    * For each grouping:
      * Get grouping
      * Get frequencies
      * Try each shift and display diffSum
      * Show shifts that are under threshold
  * Show every permutation of likely shifts to get likely keys
*/

/*
  JSON Format
  ===========
  {
    length: {
      shingles: [
        {
          size: 2,
          distances: {
            4: 10,
            8: 6
          },
          denominators: {
            1: 332,
            2: 868,
            13: 345
          }
        }
      ],
      denominatorSum: {
        1: 940,
        2: 1730,
        13: 800,
        26: 540
      },
      keyLengths: [1, 2, 13]
    },
    key: {
      lengths: [
        {
          length: 2,
          shingles: [
            {
              i: 1,
              string: "asdf",
              diffSums: {
                0: 20,
                1: 40
              },
              valid: [7, 8]
            }
          ],
          valid: [[1, 2], [6], [8, 10]]
        }
      ],
      keys: ["LOGGINS", "LONGINS"]
    }
  }
*/
