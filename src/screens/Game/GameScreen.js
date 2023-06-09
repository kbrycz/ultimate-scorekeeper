import React from 'react'
import {View, StyleSheet, Dimensions, SafeAreaView, KeyboardAvoidingView, ScrollView} from 'react-native'
import * as Color from '../../../global/Color'
import AddPlayerComponent from '../../components/AddPlayerComponent'
import CircleComponent from '../../components/CircleComponent'
import GameHeaderComponent from '../../components/GameHeaderComponent'
import PlayerItemComponent from '../../components/PlayerItemComponent'
import SimpleModalComponent from '../../components/SimpleModalComponent'
import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid'

class GameScreen extends React.Component {

    constructor() {
        super()
        this.state = {
            players: [],
            round: 1,
            modalVisible: false,
            location: ""
        }
    }

    componentDidMount() {
        this.addNewPlayer()
        if (this.props.route.params) {
            this.setState({location: this.props.route.params.location})
        }
    }

    // Sets the simple modal to be on or off
    setModalVisible = (isVisiible) => {
        this.setState({modalVisible: isVisiible})
    }

    // Adds a new player to the game. First creates an object
    addNewPlayer = () => {
        // get player initial data
        let player = {
            id: this.state.players.length,
            name: '',
            score: 0,
            status: false,
            history: [{score: 0, round: 0, prev: 0}]
        }
        
        // Set players array with new player
        let tempPlayers = this.state.players
        tempPlayers.push(player)
        this.setState({players: tempPlayers})
    }

    // Sets the name of the player in the players array
    setName = (text, index) => {
        let tempPlayers = this.state.players
        tempPlayers[index].name = text
        this.setState({players: tempPlayers})
    }

    // Changes the score of a a player. num can be either 1, 10, -1, -10, 0
    scoreChange = (index, num) => {
        let tempPlayers = this.state.players
        tempPlayers[index].score += num
        tempPlayers[index].status = true
        this.setState({players: tempPlayers})
    }

    // Return back to main menu
    quit = () => {
        this.props.navigation.navigate('Main', {screen: "Home"})
    }

    // Erase all stats from the players and reset the rounds
    restart = () => {
        let tempPlayers = this.state.players
        for (let i = 0; i < tempPlayers.length; ++i) {
            tempPlayers[i].score = 0
            tempPlayers[i].status = false
            tempPlayers[i].history = [{score: 0, round: 0, prev: 0}]
        }
        this.setState({
            round: 1,
            players: tempPlayers
        })
    }

    // Go to next round if all players have gone, if not, show modal telling them to finish
    next = () => {

        // Make sure every player is ready and store history object
        let tempPlayers = this.state.players
        for (let i = 0; i < tempPlayers.length; ++i) {
            if (!tempPlayers[i].status) {
                this.setState({
                    modalVisible: true
                })
                return
            }
            let historyRound = {
                score: tempPlayers[i].score,
                round: this.state.round,
                prev: tempPlayers[i].history[this.state.round - 1].score,
            }
            if (tempPlayers[i].history.length < this.state.round + 1) {
                tempPlayers[i].history.push(historyRound)
            }
        }

        // Another run through to make sure all of the statuses are updated
        for (let i = 0; i < tempPlayers.length; ++i) {
            tempPlayers[i].status = false
        }

        // Sets state to new values
        if (this.state.round % 3 === 0) {
            this.setState({
                round: this.state.round + 1,
                players: tempPlayers
            })
        } else {
            this.setState({
                round: this.state.round + 1,
                players: tempPlayers
            })
        }
        
    }

    // Sends user to the history page
    goToHistory = () => {
        this.props.navigation.navigate('History', {params: {players: this.state.players}, screen: 'HistoryScreen'})
    }

    // Delete player from the game
    deletePlayer = (index) => {
        let tempPlayers = this.state.players
        if (index > -1) {
            tempPlayers.splice(index, 1);
        }
        this.setState({players: tempPlayers})
    }

    // Saves the stats of the user to async storage
    saveScore = async (id) => {
        let player = null
        for (let i = 0; i < this.state.players.length; ++i) {
            if (this.state.players[i].id === id) {
                player = this.state.players[i]
            }
        }
        if (!player) {
            console.log("unable to save player stats")
            return
        }
        this.setState({hasSaved: true})
        let history = player.history
        if (player.status) {
            let historyObj = {score: player.score, round: this.state.round, prev: player.history[this.state.round - 1].score}
            history.push(historyObj)
        }
        let date = new Date()
        let game = {
            id: uuid.v4(),
            date: (date.getMonth() + 1) + "/" + date.getDate() + '/' + (date.getFullYear().toString().slice(2)),
            location: this.state.location === "" ? "Unknown" : this.state.location,
            score: player.score,
            history: history
        }
        console.log("saving stats")

        try {
            let stats = await AsyncStorage.getItem('playerStats');
            if (stats === null){
               let games = []
               games.push(game)
               await AsyncStorage.setItem("playerStats", JSON.stringify(games))
            }
            else {
                let statsList = JSON.parse(stats)
                statsList.push(game)
                await AsyncStorage.removeItem('playerStats')
                await AsyncStorage.setItem("playerStats", JSON.stringify(statsList))
           }
         } 
         catch (error) {
           console.log("unable to save data")
         }
    }

    render() {
        return (
            <View style={styles.background}>
                <CircleComponent isWhite={false} />
                <SafeAreaView style={styles.sv}>
                    <GameHeaderComponent quit={this.quit} restart={this.restart} round={this.state.round} next={this.next} goToHistory={this.goToHistory} />
                    <KeyboardAvoidingView  behavior="padding" enabled keyboardVerticalOffset={20} style={{height: Dimensions.get('window').height}}>
                    <ScrollView>
                        {
                            this.state.players.length > 0
                            ? this.state.players.map((player, index) => {
                                return <PlayerItemComponent key={index} player={player} index={index} lastIndex={this.state.players.length - 1} round={this.state.round}
                                    addNewPlayer={this.addNewPlayer} setName={this.setName} scoreChange={this.scoreChange} deletePlayer={this.deletePlayer} saveScore={this.saveScore} 
                                    players={this.state.players} />
                            })
                            : <AddPlayerComponent addNewPlayer={this.addNewPlayer} />
                        }
                    </ScrollView>
                    </KeyboardAvoidingView>
                    <SimpleModalComponent modalVisible={this.state.modalVisible} 
                                      setModalVisible={this.setModalVisible} 
                                      text={"Make sure every player has an updated score!"} buttonText={'OK'} />
                </SafeAreaView>
            </View>
        )
    }
    
}
const styles = StyleSheet.create({
    background: {
        backgroundColor: Color.MAIN,
        height: '100%',
    },
    list: {
        height: '100%',
    },
    sv: {
        marginBottom: Dimensions.get('window').height * .15,
    }
})

export default GameScreen