import { API } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { BsPencilSquare } from 'react-icons/bs';
import { LinkContainer } from 'react-router-bootstrap';
import { useAppContext } from '../lib/contextLib';
import onError from '../lib/errorLib';
import "./Home.css";
import { INote } from './NewNote';

const Home = () => {
    const [notes, setNotes] = useState<INote[]>([]);
    const { isAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const renderNotesList = (notesList: INote[]) => {
        console.log('notesList :', notesList);
        return (
            <>
                <LinkContainer to="/notes/new">
                    <ListGroup.Item action className="py-3 text-nowrap text-truncate">
                        <BsPencilSquare size={17} />
                        <span className="ml-2 font-weight-bold">Create a new note</span>
                    </ListGroup.Item>
                </LinkContainer>
                {notesList.map(({ noteId, note, createdAt }) => (
                    <LinkContainer key={noteId} to={`/notes/${noteId}`}>
                        <ListGroup.Item action>
                            <span className="font-weight-bold">
                                {note.trim().split("/n")[0]}
                            </span>
                            <br />
                            <span className="text-muted">
                                Created: {new Date(createdAt!).toLocaleString()}
                            </span>
                        </ListGroup.Item>
                    </LinkContainer>
                ))}
            </>
        )
    }

    const renderLander = () => {
        return (
            <div className="lander">
                <h1>Notus</h1>
                <p className='text-muted'>
                    its not a simple note taking app
                </p>
            </div>
        )
    }

    const renderNotes = () => {
        return (
            <div className='notes'>
                <h2 className='pb-3 mt-4 border-bottom'> Your Notes </h2>
                <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
            </div>
        )
    }

    useEffect(() => {
        const onLoad = async () => {
            if (!isAuthenticated) {
                return;
            }
            try {
                const notes = await loadNotes();
                setNotes(notes);
            } catch (error) {
                onError(error);
            }
            setIsLoading(false);
        }

        onLoad();
    }, [isAuthenticated])

    const loadNotes = async () => {
        return API.get("notes", "/notes", {});
    }

    return (
        <div className='Home'>
            {isAuthenticated ? renderNotes() : renderLander()}
        </div>
    )
}

export default Home;