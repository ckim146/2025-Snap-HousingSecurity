      <View style={styles.cardContainer}>
        <View
          style={[
            styles.card,
            {
              position: "absolute",
              alignSelf: "center", // center horizontally
              top: "70%",
              transform: [
                { translateX: -100 },
                { translateY: 12 }, // half of card height to center vertically
                { rotate: "-7deg" },
              ],
              backgroundColor: Color(colorCategoryMap[orgCardData[0].type])
                .darken(0.2)
                .rgb()
                .string(), // match first card's color
              zIndex: 0,
            },
          ]}
        />
        <Swiper
          cards={orgCardData}
          renderCard={(card) => (
            
              <View
                style={[
                  styles.card,
                  { backgroundColor: colorCategoryMap[card.type] },
                ]}
              >
                {/*The horizontal view containing category and card # */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={[
                      styles.categoryTag,
                      {
                        backgroundColor: Color(colorCategoryMap[card.type])
                          .lighten(0.1)
                          .rgb()
                          .string(),
                        alignSelf: "flex-start",
                        borderColor: Color(colorCategoryMap[card.type])
                          .darken(0.7)
                          .rgb()
                          .string(),
                      },
                    ]}
                  >
                    <Text
                      style={{
                        alignSelf: "center",
                        color: Color(colorCategoryMap[card.type])
                          .darken(0.7)
                          .rgb()
                          .string(),
                        fontSize: 10,
                      }}
                    >
                      {card.type}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: Color(colorCategoryMap[card.type])
                        .darken(0.7)
                        .rgb()
                        .string(),
                    }}
                  >
                    {cardIndex + 1}/{orgCardData.length}
                  </Text>
                </View>

                {card.type == "Tips" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 10,
                      marginTop: 10,
                    }}
                  >
                    <Image
                      source={card.profilePic}
                      style={{
                        resizeMode: "cover",
                        height: 50,
                        width: 50,
                        marginRight: 10,
                      }}
                    />
                    <View style={{ flexDirection: "column" }}>
                      <Text style={[styles.title, { marginBottom: 0 }]}>
                        {card.user}
                      </Text>
                      <Text
                        style={{
                          color: Color(colorCategoryMap[card.type])
                            .darken(0.5)
                            .rgb()
                            .string(),
                        }}
                      >
                        Verified Member
                      </Text>
                    </View>
                  </View>
                ) : null}
                <Pressable onPress={() => handleCardTouch(card)}>
                <Text
                  style={{
                    fontSize: 22,
                    color: "#4b3b1f",
                    marginBottom: 12,
                  }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                >
                  {card.title}
                </Text>
                </Pressable>
                <View style={{ flexDirection: "column" }}>
                  <Text
                    style={[
                      styles.title,
                      {
                        marginBottom: 0,
                        marginTop: 0,
                        color: Color(colorCategoryMap[card.type])
                          .darken(0.7)
                          .rgb()
                          .string(),
                      },
                    ]}
                  >
                    {card.date}
                  </Text>
                  <Text
                    style={{
                      color: Color(colorCategoryMap[card.type])
                        .darken(0.7)
                        .rgb()
                        .string(),
                    }}
                  >
                    {card.time}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: Color(colorCategoryMap[card.type])
                        .darken(0.5)
                        .rgb()
                        .string(),
                    }}
                  >
                    {card.age} ago
                  </Text>
                  <IonIcon name="arrow-redo-outline" size={20}></IonIcon>
                </View>
              </View>
            
          )}
          onSwiped={(index) => setCardIndex(index + 1)}
          onSwipedAll={() => setCardIndex(0)}
          cardIndex={0}
          backgroundColor={"#f0f0f0"}
          stackSize={3}
          stackSeparation={15}
          animateCardOpacity
          // disableBottomSwipe
          // disableTopSwipe
        />
      </View>

      const styles = StyleSheet.create({
        Events: {
          padding: 20,
          width: "100%",
          display: "flex",
          gap: 10,
          flexDirection: "column",
          alignItems: "center",
        },
        container: {
          width: "48%",
          backgroundColor: "#E5E5E5",
          display: "flex",
          justifyContent: "space-between",
          // alignItems:"center",
          padding: 10,
          // gap:10,
          borderRadius: 20,
          maxHeight: 250,
          margin: 0,
        },
        bitmojiUser: {
          width: 28,
          aspectRatio: 1,
          borderRadius: 1000,
          margin: 0,
        },
        title: {
          textAlign: "left",
          marginTop: 8,
          marginBottom: 5,
          fontSize: 15,
        },
        subtitle: {
          marginTop: 2,
          marginBottom: 5,
          fontSize: 13,
          color: "#575757",
          width: "60%",
        },
        userInfo: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          margin: 0,
        },
        friends: {
          position: "absolute",
          top: 15,
          left: 15,
          zIndex: 100,
          backgroundColor: "#fffc00",
          margin: 0,
          borderRadius: 20,
          padding: 10,
        },
        friendsText: {
          fontWeight: "bold",
          fontSize: 10,
        },
        username: {
          fontSize: 11,
          margin: 0,
          fontWeight: "bold",
          color: "#575757",
        },
        addButton: {
          position: "absolute",
          bottom: 110,
          right: 30,
        },
        EventScreen: {
          height: "100%",
          backgroundColor: "#a67637",
        },
        orgContainer: {
          width: "90%",
          height: 120,
          padding: 10,
          backgroundColor: "#f5d4a9",
          borderRadius: 10,
          marginBottom: 20,
          alignItems: "center",
          alignSelf: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          display: "flex",
          flexDirection: "row",
        },
        plusButtonContainer: {
          position: "absolute",
          right: 15,
          top: "60%",
          transform: [{ translateY: -15 }], // half of icon size to center vertically
        },
        mainHeader: {
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          color: "#473927",
          marginTop: 10,
          marginBottom: 0,
        },
        searchInput: {
          // margin: 20,
          borderWidth: 0,
          borderRadius: 100,
          padding: 10,
          backgroundColor: "#f5d4a9",
          width: "100%",
          paddingLeft: 45,
        },
        nextButton: {
          borderRadius: 100,
          backgroundColor: "#7a5728",
          width: 120,
          alignSelf: "center",
          padding: 5,
        },
        searchBarContainer: {
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "center",
          width: 350,
          marginTop: 10,
        },
        findButton: {
          borderRadius: 100,
          backgroundColor: "#7a5728",
          width: 200,
          alignSelf: "center",
          padding: 5,
          marginTop: 15,
        },
        card: {
          height: 200,
          width: 200,
          borderRadius: 10,
          backgroundColor: "white",
          paddingHorizontal: 20,
          paddingVertical: 10, // smaller top padding
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 10,
          justifyContent: "space-between",
        },
        title: {
          fontSize: 22,
          fontWeight: "bold",
          marginBottom: 10,
          flexShrink: 1,
        },
        cardContainer: {
          flex: 1,
          justifyContent: "center",
        },
        categoryTag: {
          borderWidth: 1,
          borderRadius: 100,
          padding: 2,
          paddingHorizontal: 20,
          backgroundColor: "#f5d4a9",
          alignItems: "center",
        },
        overlay: {
          ...StyleSheet.absoluteFillObject,  // fills entire screen
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black
        },
      });